// src/components/UserInfoProfile.tsx

import Avatar from './AvatarGenerator';
import { useAuth } from '../../hooks/useAuth';

export default function UserInfoProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isActive = user.status === true;

  const statusColor = user.status
    ? 'bg-emerald-100 text-emerald-600'
    : 'bg-red-100 text-red-600';

  const statusDot = isActive ? 'bg-emerald-400' : 'bg-red-400 ';
  const statusLabel = isActive ? 'Active' : 'Banned';
  // console.log(statusLabel,isActive);

  return (
    <div className="group relative flex justify-center cursor-pointer">
      {/* Avatar */}
      <div className="rounded-full ring-2 ring-transparent  ring-offset-2 ring-offset-[var(--card)] transition-all duration-200">
        <Avatar name={user.name} size={44} />
      </div>

      <div
        className="
          absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50
          w-40 rounded-xl bg-[var(--card)] px-4 py-3
          opacity-0 pointer-events-none scale-95 origin-top
          group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100
          transition-all duration-200 ease-out
        "
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.14)' }}
      >
        {/* Arrow */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '8px solid var(--card)',
          }}
        />

        {/* Name */}
        <p className="text-sm font-semibold text-text-primary truncate leading-tight">
          {user.name}
        </p>

        {/* Email */}
        <p className="text-xs text-text-tertiary truncate leading-tight mt-0.5">
          {user.email}
        </p>

        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          {/* Role badge */}
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isAdmin ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {isAdmin ? '⚡ Admin' : '✓ User'}
          </span>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}