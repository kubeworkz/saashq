import classNames from "classnames";
import Navbar from "./Navbar";
import Link from "next/link";
import Dropdown from "./Dropdown";
import {
  CreditCard,
  Logout,
  Settings,
} from "tabler-icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import Card2 from "./Card2";
import * as allIcons from "tabler-icons-react";
import { useSession } from "next-auth/react";

export function Dashboard(props: { children: any; classes?: string }) {
  const session = useSession();

  return (
    <div className="min-h-screen bg-dots">
      <div className="flex w-full flex-col gap-8">
        <Navbar classes="justify-between max-w-7xl m-auto lg:px-6 px-4 ">
          <Link href={`../../dashboard/`} className="flex items-end gap-2">
            <Image
              className="m-0 p-0"
              alt="Logo"
              src="/branding/icon-b.png"
              width={36}
              height={36}
            />
          </Link>
          <Navbar.Section>
            <Dropdown
              title={
                <Image
                  alt="User"
                  src={"" + session.data?.user?.image}
                  className="h-8 w-8 rounded-full"
                />
              }
            >
              <Dropdown.Item icon={<Settings size={20} />}>
                <a href="../../dashboard/account">Account</a>
              </Dropdown.Item>
              <Dropdown.Item icon={<CreditCard size={20} />}>
              <a href="../../dashboard/subscription">Subscription</a>
              </Dropdown.Item>
              <Dropdown.Item icon={<Logout size={20} />}>
              <a href="../../auth/logout">Logout</a>

              </Dropdown.Item>
            </Dropdown>
          </Navbar.Section>
        </Navbar>
        <div className="m-auto flex w-full max-w-7xl flex-col gap-6 px-4 lg:px-6">
          <div className="flex flex-row flex-wrap items-start gap-8 sm:flex-nowrap">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLink(props: { item: any; route: string }) {
  const router = useRouter();

  const iconNameToBeUsed: any = props.item.sidebarProps.icon;
  const IconToBeUsed: any = allIcons[iconNameToBeUsed];

  const active =
    router.pathname ==
    "/" +
      props.route +
      (props.item.sidebarProps.page.length > 1
        ? "/" + props.item.sidebarProps.page
        : "");
  return (
    <button
      onClick={() =>
        void router.push("/" + props.route + "/" + props.item.sidebarProps.page)
      }
      className={classNames(
        "flex flex-row items-center gap-3 px-2 py-3 text-sm border-l-2 ",
        {
          "font-medium bg-slate-100 ": active,
          "text-gray-500  border-transparent ": !active
        }
      )}
    >
      <span>
        <IconToBeUsed strokeWidth={active ? 2.5 : 2} size={18} />
      </span>
      <span>{props.item.sidebarProps.displayTitle}</span>
    </button>
  );
}

function AdminSidebar(props: { sidebarProps: any }) {
  return (
    <div className="w-full sm:max-w-xs">
      <div className="flex w-full flex-col gap-1">
        {props.sidebarProps.map((item: any) => (
          <DashboardLink route="admin" item={item} key={item.page} />
        ))}
      </div>
    </div>
  );
}

function UserSidebar(props: { sidebarProps: any }) {
  return (
    <div className="hidden sm:flex sm:w-full sm:max-w-xs sm:grow">
      <div className="flex w-full flex-col gap-1">
        {props.sidebarProps.map((item: any) => (
          <DashboardLink route="dashboard" item={item} key={item.page} />
        ))}
      </div>
    </div>
  );
}

export function User(props: {
  children: any;
  sidebarProps?: any;
  noCard?: boolean;
  loading: boolean;
}) {
  return (
    <>
      <Dashboard>
        {props.sidebarProps && (
          <UserSidebar sidebarProps={props.sidebarProps} />
        )}

        {props.loading == true && (
          <div className="grid h-full w-full w-full place-items-center py-20">
            <div className="text-gray-400">
              <allIcons.Loader2 className="animate-spin" />
            </div>
          </div>
        )}
        {props.loading == false && (
          <>
            {!props.noCard ? (
              <Card2 classes="w-full">{props.children}</Card2>
            ) : (
              <>{props.children}</>
            )}
          </>
        )}
      </Dashboard>
    </>
  );
}

export function Admin(props: {
  children: any;
  sidebarProps: any;
  loading: boolean;
}) {
  return (
    <>
      <Dashboard>
        <AdminSidebar sidebarProps={props.sidebarProps} />
        {props.loading == true && (
          <div className="grid h-full w-full w-full place-items-center py-20">
            <div className="text-gray-400">
              <allIcons.Loader2 className="animate-spin" />
            </div>
          </div>
        )}
        {props.loading == false && props.children}
      </Dashboard>
    </>
  );
}

Dashboard.User = User;
Dashboard.Admin = Admin;

export default Dashboard;
