import { useState } from "react";
// Ambil inisial dari nama
function getInitials(name = "") {
  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

function stringToColor(str = "") {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

export default function Avatar({
  name = "User",
  src = "",
  size = 40,
  fontSize = 40 / 2.5,
  rounded = true,
  className = "",
}) {
  const [imgError, setImgError] = useState(false);  // ← tambah state
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const borderRadius = rounded ? "50%" : 0;

  if (src && !imgError) {  // ← cek imgError
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className={className}
        style={{ width: size, height: size, borderRadius, objectFit: "cover" }}
        onError={() => setImgError(true)}  // ← trigger fallback
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: bgColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        fontSize: fontSize || size / 2.5,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}