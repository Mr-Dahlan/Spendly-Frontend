import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";

const themeState = { current: "light" as "light" | "dark" };

export function setAlertTheme(theme: "light" | "dark") {
  themeState.current = theme;
}

// ─────────────────────────────────────────────
// BASE CONFIG — semua alert pakai ini sebagai dasar
// ─────────────────────────────────────────────

const baseConfig: SweetAlertOptions = {
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#6b7280",
  reverseButtons: true,
  customClass: {
    popup: "rounded-xl shadow-xl text-sm",
    confirmButton: "rounded-lg px-5 py-2 text-sm font-medium",
    cancelButton: "rounded-lg px-5 py-2 text-sm font-medium",
  },
};

// ─────────────────────────────────────────────
// TOAST CONFIG — notifikasi kecil di sudut layar
// ─────────────────────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  theme: themeState.current,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// ═════════════════════════════════════════════
// 1. CONFIRM — dialog konfirmasi dua pilihan
// ═════════════════════════════════════════════
interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: SweetAlertOptions["icon"];
  danger?: boolean; // true = confirm button merah
}

export const alert = {
  /**
   * Dialog konfirmasi — returns true jika user klik confirm
   * @example
   * const ok = await alert.confirm({ title: 'Hapus?', danger: true });
   * if (ok) { ... }
   */
  confirm: async (options: ConfirmOptions = {}): Promise<boolean> => {
    const {
      title = "Yakin?",
      text,
      confirmText = "Ya, lanjutkan",
      cancelText = "Batal",
      icon = "warning",
      danger = false,
    } = options;

    const result = await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon,
      theme: themeState.current,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: danger ? "#ef4444" : "#2563eb",
    });

    return result.isConfirmed;
  },

  // ═════════════════════════════════════════════
  // 2. SUCCESS — notifikasi berhasil
  // ═════════════════════════════════════════════
  /**
   * @example
   * alert.success('Data berhasil disimpan!');
   * alert.success('Akun dibuat', 'Selamat bergabung!');
   */
  success: (title: string, text?: string) => {
    return Swal.fire({
      ...baseConfig,
      title,
      text,
      theme: themeState.current,
      icon: "success",
      confirmButtonText: "OK",
    });
  },

  // ═════════════════════════════════════════════
  // 3. ERROR — notifikasi gagal / error
  // ═════════════════════════════════════════════
  /**
   * @example
   * alert.error('Gagal menyimpan data');
   * alert.error('Terjadi kesalahan', 'Coba lagi beberapa saat.');
   */
  error: (title: string, text?: string) => {
    return Swal.fire({
      ...baseConfig,
      title,
      text,
      theme: themeState.current,
      icon: "error",
      confirmButtonText: "Tutup",
    });
  },

  // ═════════════════════════════════════════════
  // 4. WARNING — peringatan (tanpa cancel button)
  // ═════════════════════════════════════════════
  /**
   * @example
   * alert.warning('Sesi hampir habis!');
   */
  warning: (title: string, text?: string) => {
    return Swal.fire({
      ...baseConfig,
      title,
      text,
      theme: themeState.current,
      icon: "warning",
      confirmButtonText: "Mengerti",
    });
  },

  // ═════════════════════════════════════════════
  // 5. INFO — informasi umum
  // ═════════════════════════════════════════════
  /**
   * @example
   * alert.info('Fitur ini masih dalam pengembangan.');
   */
  info: (title: string, text?: string) => {
    return Swal.fire({
      ...baseConfig,
      title,
      text,
      theme: themeState.current,
      icon: "info",
      confirmButtonText: "OK",
    });
  },

  // ═════════════════════════════════════════════
  // 6. TOAST — notifikasi kecil di sudut (auto close)
  // ═════════════════════════════════════════════
  toast: {
    /**
     * @example
     * alert.toast.success('Data tersimpan!');
     */
    success: (title: string) => Toast.fire({ icon: "success", title }),

    /**
     * @example
     * alert.toast.error('Gagal menghubungi server.');
     */
    error: (title: string) => Toast.fire({ icon: "error", title }),

    /**
     * @example
     * alert.toast.warning('Koneksi tidak stabil.');
     */
    warning: (title: string) => Toast.fire({ icon: "warning", title }),

    /**
     * @example
     * alert.toast.info('Ada pembaruan tersedia.');
     */
    info: (title: string) => Toast.fire({ icon: "info", title }),
  },

  // ═════════════════════════════════════════════
  // 7. LOADING — tampilkan spinner saat proses async
  // ═════════════════════════════════════════════
  /**
   * Tampilkan loading, tutup manual dengan alert.close()
   * @example
   * alert.loading('Menyimpan data...');
   * await saveData();
   * alert.close();
   * alert.toast.success('Tersimpan!');
   */
  loading: (title: string = "Memuat...", text?: string) => {
    Swal.fire({
      title,
      text,
      theme: themeState.current,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });
  },

  // ═════════════════════════════════════════════
  // 8. CLOSE — tutup alert yang sedang tampil
  // ═════════════════════════════════════════════
  /**
   * @example
   * alert.close();
   */
  close: () => Swal.close(),
};

