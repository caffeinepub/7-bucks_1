import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type ContiPayCredentials = Text;

  type Transaction = {
    timestampNanos : Int;
    amountUsd : Nat;
    totalCharged : Nat;
    status : { #pending; #success; #failed };
    contiPayReference : ?Text;
    contiPayError : ?Text;
  };

  module Transaction {
    public func compare(t1 : Transaction, t2 : Transaction) : Order.Order {
      Int.compare(t2.timestampNanos, t1.timestampNanos);
    };
  };

  let credentialStore = Map.empty<Text, ContiPayCredentials>();
  let transactionStore = Map.empty<Int, Transaction>();

  public shared ({ caller }) func createOrUpdateApiCredentials(identifier : Text, credentials : Text, _updateexisting : ?Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can manage API credentials");
    };
    credentialStore.add(identifier, credentials);
  };

  func resolveOrchestratePayment(_transactionId : Text, _amountUsd : Nat, _fcaAccount : Text) : Transaction {
    Runtime.trap(
      "The orchestration is incomplete due to missing ContiPay endpoint and field specifications. Please configure the correct endpoints and required fields as per ContiPay instructions. Once provided, the implementation can complete the integration. Current state: initialization and persistence only."
    );
  };

  public shared ({ caller }) func orchestratePayment(transactionId : Text, amountUsd : Nat, fcaAccount : Text) : async Transaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can initiate payments");
    };
    resolveOrchestratePayment(transactionId, amountUsd, fcaAccount);
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view transactions");
    };

    transactionStore.values().toArray().sort();
  };
};
