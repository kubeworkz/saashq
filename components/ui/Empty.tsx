import { CashBanknote, CreditCard, Key, Package, UserSearch } from "tabler-icons-react";
import Card2 from "./Card2";

export function EmptyProducts() {
  return (
    <Card2 classes="bg-slate-100 shadow-none grid">
      <div className="flex flex-col items-start gap-4 rounded-md bg-slate-100 p-6">
        <div className="text-gray-600">
          <Package size={28} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800">
            You have no products yet
          </p>
          <p className="text-sm font-normal text-gray-400">
            Create products and sell them to your users.
          </p>
        </div>
      </div>
    </Card2>
  );
}

export function EmptySubscriptions() {
  return (
    <Card2 classes="bg-slate-100 shadow-none grid">
      <div className="flex flex-col items-start gap-4 rounded-md bg-slate-100 p-6">
        <div className="text-gray-600">
          <CreditCard size={28} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800">
            No subscriptions yet
          </p>
          <p className="text-sm font-normal text-gray-400">
            No users have subscriptions yet. When they purchase one, it will
            appear here.
          </p>
        </div>
      </div>
    </Card2>
  );
}

export function EmptyPayments() {
  return (
    <Card2 classes="bg-slate-100 shadow-none grid">
      <div className="flex flex-col items-start gap-4 rounded-md bg-slate-100 p-6">
        <div className="text-gray-600">
          <CashBanknote size={28} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800">No payments yet</p>
          <p className="text-sm font-normal text-gray-400">
            Payments from users will appear here.
          </p>
        </div>
      </div>
    </Card2>
  );
}


export function EmptyUsers() {
  return (
    <Card2 classes="bg-slate-100 shadow-none grid">
      <div className="flex flex-col items-start gap-4 rounded-md bg-slate-100 p-6">
        <div className="text-gray-600">
          <UserSearch size={28} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800">No users</p>
          <p className="text-sm font-normal text-gray-400">
            No users to show
          </p>
        </div>
      </div>
    </Card2>
  );
}


export function EmptyRoles() {
  return (
    <Card2 classes="bg-slate-100 shadow-none grid">
      <div className="flex flex-col items-start gap-4 rounded-md bg-slate-100 p-6">
        <div className="text-gray-600">
          <Key size={28} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800">No roles</p>
          <p className="text-sm font-normal text-gray-400">
            No roles have been created yet.
          </p>
        </div>
      </div>
    </Card2>
  );
}
