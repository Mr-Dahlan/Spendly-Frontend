// src/components/ui/UserManagementTable.tsx

import { useState } from "react";

import {
  ShieldOff,
  ShieldCheck,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";

import type { User } from "../../types/users";

import BannedAccountModal from "./BannedAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

interface UserManagementTableProps {
  users: User[];

  isLoading?: boolean;

  onBanUser: (
    userId: number,
    reason: string
  ) => Promise<void>;

  onActivateUser: (
    userId: number
  ) => Promise<void>;

  onMakeAdmin: (
    userId: number
  ) => Promise<void>;

  onDeleteUser: (
    userId: number
  ) => Promise<void>;

  isBanning?: boolean;
  isDeleting?: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function UserManagementTable({
  users,
  isLoading,

  onBanUser,
  onActivateUser,
  onMakeAdmin,
  onDeleteUser,

  isBanning,
  isDeleting,
}: UserManagementTableProps) {
  const [page, setPage] = useState(1);

  const [filterStatus, setFilterStatus] =
    useState<
      "all" | "active" | "suspended"
    >("all");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [adminModalOpen, setAdminModalOpen] =
    useState(false);

  const [banModal, setBanModal] =
    useState<{
      open: boolean;
      user: User | null;
    }>({
      open: false,
      user: null,
    });

  const [deleteModal, setDeleteModal] =
    useState<{
      open: boolean;
      user: User | null;
    }>({
      open: false,
      user: null,
    });

  const filtered = users.filter((u) => {
    if (filterStatus === "active")
      return u.status === true;

    if (filterStatus === "suspended")
      return u.status === false;

    return true;
  });

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{
          background: "var(--card)",
          boxShadow: "var(--boxShadow)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3
              className="font-semibold text-base"
              style={{
                color: "var(--text)",
              }}
            >
              User Management
            </h3>

            <p
              className="text-xs mt-0.5"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Manage users, roles,
              permissions, and account
              status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setFilterOpen(
                    !filterOpen
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                style={{
                  borderColor:
                    "var(--border)",

                  color:
                    "var(--text-secondary)",

                  background:
                    "var(--bg)",
                }}
              >
                <Filter size={14} />

                Filter

                {filterStatus !==
                  "all" && (
                  <span
                    className="ml-1 w-2 h-2 rounded-full"
                    style={{
                      background:
                        "var(--blue-primary)",
                    }}
                  />
                )}
              </button>

              {/* Dropdown */}
              {filterOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-10 border w-36"
                  style={{
                    background:
                      "var(--card-secondery)",

                    borderColor:
                      "var(--border)",

                    boxShadow:
                      "var(--boxShadow)",
                  }}
                >
                  {(
                    [
                      "all",
                      "active",
                      "suspended",
                    ] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterStatus(
                          s
                        );

                        setFilterOpen(
                          false
                        );

                        setPage(1);
                      }}
                      className="w-full px-4 py-2.5 text-sm text-left capitalize transition-colors hover:opacity-80"
                      style={{
                        background:
                          filterStatus ===
                          s
                            ? "var(--blue-primary)"
                            : "transparent",

                        color:
                          filterStatus ===
                          s
                            ? "white"
                            : "var(--text)",
                      }}
                    >
                      {s === "all"
                        ? "All Users"
                        : s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Admin */}
            <button
              onClick={() =>
                setAdminModalOpen(true)
              }
              className="h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-90"
              style={{
                background:
                  "var(--blue-primary)",
                color: "white",
              }}
            >
              <UserPlus size={15} />
              Add Admin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid var(--border)",
                }}
              >
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Joined Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {isLoading ? (
                Array.from({ length: 4 }).map(
                  (_, i) => (
                    <tr key={i}>
                      {Array.from({
                        length: 6,
                      }).map((_, j) => (
                        <td
                          key={j}
                          className="py-3 pr-4"
                        >
                          <div
                            className="h-4 rounded animate-pulse"
                            style={{
                              background:
                                "var(--bg)",

                              width:
                                j === 5
                                  ? "120px"
                                  : "100%",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                )
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr
                    key={user.user_id}
                    style={{
                      borderBottom:
                        "1px solid var(--border)",
                    }}
                  >
                    {/* Name */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background:
                              "var(--blue-primary)",

                            color: "white",
                          }}
                        >
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span
                          className="font-medium"
                          style={{
                            color:
                              "var(--text)",
                          }}
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 pr-4">
                      <span
                        style={{
                          color:
                            "var(--text-secondary)",
                        }}
                      >
                        {user.email}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3 pr-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={
                          user.role ===
                          "admin"
                            ? {
                                background:
                                  "rgba(245,158,11,0.12)",

                                color:
                                  "#f59e0b",
                              }
                            : {
                                background:
                                  "var(--bg)",

                                color:
                                  "var(--text-secondary)",
                              }
                        }
                      >
                        {user.role ===
                        "admin"
                          ? "ADMIN"
                          : "USER"}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 pr-4">
                      <span
                        style={{
                          color:
                            "var(--text-secondary)",
                        }}
                      >
                        {new Date(
                          user.created_at
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={
                          user.status
                            ? {
                                background:
                                  "var(--green-secondary)",

                                color:
                                  "var(--green-primary)",
                              }
                            : {
                                background:
                                  "rgba(220,38,38,0.1)",

                                color:
                                  "var(--red-primary)",
                              }
                        }
                      >
                        {user.status
                          ? "ACTIVE"
                          : "SUSPENDED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3">
                      <div className="flex items-center gap-2 flex-wrap">

                        {/* Suspend / Activate */}
                        {user.status ? (
                          <button
                            onClick={() =>
                              setBanModal({
                                open: true,
                                user,
                              })
                            }
                            className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
                            style={{
                              background:
                                "rgba(239,68,68,0.1)",

                              color:
                                "var(--red-primary)",
                            }}
                          >
                            <ShieldOff
                              size={13}
                            />

                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              onActivateUser(
                                user.user_id
                              )
                            }
                            className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
                            style={{
                              background:
                                "rgba(34,197,94,0.1)",

                              color:
                                "var(--green-primary)",
                            }}
                          >
                            <ShieldCheck
                              size={13}
                            />

                            Activate
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              user,
                            })
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80"
                          style={{
                            background:
                              "rgba(239,68,68,0.1)",
                          }}
                        >
                          <Trash2
                            size={14}
                            style={{
                              color:
                                "var(--red-primary)",
                            }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p
              className="text-xs"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Showing{" "}
              {Math.min(
                (page - 1) *
                  ITEMS_PER_PAGE +
                  1,
                filtered.length
              )}
              –
              {Math.min(
                page * ITEMS_PER_PAGE,
                filtered.length
              )}{" "}
              of {filtered.length} users
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                style={{
                  background:
                    "var(--bg)",
                }}
              >
                <ChevronLeft
                  size={14}
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                />
              </button>

              {Array.from({
                length: totalPages,
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPage(i + 1)
                  }
                  className="w-7 h-7 rounded-lg text-xs font-semibold"
                  style={{
                    background:
                      page === i + 1
                        ? "var(--blue-primary)"
                        : "var(--bg)",

                    color:
                      page === i + 1
                        ? "white"
                        : "var(--text-secondary)",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                disabled={
                  page === totalPages
                }
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                style={{
                  background:
                    "var(--bg)",
                }}
              >
                <ChevronRight
                  size={14}
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Modal */}
      <BannedAccountModal
        isOpen={banModal.open}
        user={banModal.user}
        onClose={() =>
          setBanModal({
            open: false,
            user: null,
          })
        }
        onConfirm={onBanUser}
        isLoading={isBanning}
      />

      {/* Delete Modal */}
      <DeleteAccountModal
        isOpen={deleteModal.open}
        user={deleteModal.user}
        onClose={() =>
          setDeleteModal({
            open: false,
            user: null,
          })
        }
        onConfirm={onDeleteUser}
        isLoading={isDeleting}
      />

      {/* Add Admin Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-5 flex flex-col gap-4"
            style={{
              background:
                "var(--card)",
              boxShadow:
                "var(--boxShadow)",
            }}
          >
            {/* Header */}
            <div>
              <h3
                className="text-lg font-semibold"
                style={{
                  color:
                    "var(--text)",
                }}
              >
                Add New Admin
              </h3>

              <p
                className="text-sm mt-1"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Select a user to
                promote as admin.
              </p>
            </div>

            {/* User List */}
            <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
              {users
                .filter(
                  (u) =>
                    u.role !== "admin"
                )
                .map((user) => (
                  <button
                    key={user.user_id}
                    onClick={async () => {
                      await onMakeAdmin(
                        user.user_id
                      );

                      setAdminModalOpen(
                        false
                      );
                    }}
                    className="w-full p-3 rounded-xl flex items-center justify-between hover:opacity-80"
                    style={{
                      background:
                        "var(--bg)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background:
                            "var(--blue-primary)",

                          color:
                            "white",
                        }}
                      >
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="text-left">
                        <p
                          className="text-sm font-medium"
                          style={{
                            color:
                              "var(--text)",
                          }}
                        >
                          {user.name}
                        </p>

                        <p
                          className="text-xs"
                          style={{
                            color:
                              "var(--text-secondary)",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          "var(--blue-primary)",
                      }}
                    >
                      Promote
                    </span>
                  </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setAdminModalOpen(
                    false
                  )
                }
                className="h-10 px-4 rounded-xl text-sm font-medium"
                style={{
                  background:
                    "var(--bg)",

                  color:
                    "var(--text)",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}