import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Transaction {
    status: Variant_pending_success_failed;
    contiPayReference?: string;
    totalCharged: bigint;
    contiPayError?: string;
    amountUsd: bigint;
    timestampNanos: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_success_failed {
    pending = "pending",
    success = "success",
    failed = "failed"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateTotalCost(amountUsd: bigint): Promise<bigint>;
    createOrUpdateApiCredentials(identifier: string, credentials: string, _updateexisting: boolean | null): Promise<void>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    orchestratePayment(transactionId: string, amountUsd: bigint, fcaAccount: string): Promise<Transaction>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
