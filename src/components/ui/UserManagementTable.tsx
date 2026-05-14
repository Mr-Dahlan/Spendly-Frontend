// src/components/admin/UserManagementTable.tsx
import { useState } from "react";
import { Eye, ShieldOff, Trash2, Filter, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "../../types/users";
import BannedAccountModal from "./BannedAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

interface UserManagementTableProps {
  users: User[];
  isLoading?: boolean;
  onBanUser: (userId: number, reason: string) => Promise<void>;
  onDeleteUser: (userId: number) => Promise<void>;
  onViewUser?: (user: User) => void;
  onAddAdmin?: () => void;
  isBanning?: boolean;
  isDeleting?: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function UserManagementTable({
  users,
  isLoading,
  onBanUser,
  onDeleteUser,
  onViewUser,
  onAddAdmin,
  isBanning,
  isDeleting,
}: UserManagementTableProps) {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [banModal, setBanModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });

  const filtered = users.filter((u) => {
    if (filterStatus === "active") return u.status === true;
    if (filterStatus === "suspended") return u.status === false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
              User Management
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Manage registration, permissions, and status of all platform users.
            </p>
          </div>
          <div className="flex gap-2">
            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg)" }}
              >
                <Filter size={14} />
                Filter
                {filterStatus !== "all" && (
                  <span
                    className="ml-1 w-2 h-2 rounded-full"
                    style={{ background: "var(--blue-primary)" }}
                  />
                )}
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-10 border w-36"
                  style={{ background: "var(--card-secondery)", borderColor: "var(--border)", boxShadow: "var(--boxShadow)" }}
                >
                  {(["all", "active", "suspended"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setFilterStatus(s); setFilterOpen(false); setPage(1); }}
                      className="w-full px-4 py-2.5 text-sm text-left capitalize transition-colors hover:opacity-80"
                      style={{
                        background: filterStatus === s ? "var(--blue-primary)" : "transparent",
                        color: filterStatus === s ? "white" : "var(--text)",
                      }}
                    >
                      {s === "all" ? "All Users" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Admin */}
            <button
              onClick={onAddAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--blue-primary)", color: "white" }}
            >
              <UserPlus size={14} />
              New Admin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Email", "Joined Date", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-3 pr-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: "var(--bg)", width: j === 4 ? "80px" : "100%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr
                    key={user.user_id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                    className="transition-colors hover:opacity-90"
                  >
                    {/* Name */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: "var(--blue-primary)", color: "white" }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium" style={{ color: "var(--text)" }}>{user.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="py-3 pr-4">
                      <span style={{ color: "var(--text-secondary)" }}>{user.email}</span>
                    </td>
                    {/* Joined */}
                    <td className="py-3 pr-4">
                      <span style={{ color: "var(--text-secondary)" }}>
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="py-3 pr-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={
                          user.status
                            ? { background: "var(--green-secondary)", color: "var(--green-primary)" }
                            : { background: "rgba(220,38,38,0.1)", color: "var(--red-primary)" }
                        }
                      >
                        {user.status ? "ACTIVE" : "SUSPENDED"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewUser?.(user)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                          style={{ background: "var(--bg)" }}
                          title="View"
                        >
                          <Eye size={14} style={{ color: "var(--text-secondary)" }} />
                        </button>
                        <button
                          onClick={() => setBanModal({ open: true, user })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                          style={{ background: "rgba(99,102,241,0.1)" }}
                          title="Ban"
                        >
                          <ShieldOff size={14} style={{ color: "var(--blue-primary)" }} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, user })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                          style={{ background: "rgba(220,38,38,0.1)" }}
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: "var(--red-primary)" }} />
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
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 hover:opacity-70 transition-colors"
                style={{ background: "var(--bg)" }}
              >
                <ChevronLeft size={14} style={{ color: "var(--text-secondary)" }} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className="w-7 h-7 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                  style={{
                    background: page === i + 1 ? "var(--blue-primary)" : "var(--bg)",
                    color: page === i + 1 ? "white" : "var(--text-secondary)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 hover:opacity-70 transition-colors"
                style={{ background: "var(--bg)" }}
              >
                <ChevronRight size={14} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BannedAccountModal
        isOpen={banModal.open}
        user={banModal.user}
        onClose={() => setBanModal({ open: false, user: null })}
        onConfirm={onBanUser}
        isLoading={isBanning}
      />
      <DeleteAccountModal
        isOpen={deleteModal.open}
        user={deleteModal.user}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={onDeleteUser}
        isLoading={isDeleting}
      />
    </>
  );
}