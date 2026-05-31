
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
  size = 40,
  fontSize = 40 / 2.5,
  rounded = true,
  className = "",
}) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: rounded ? "50%" : "8px",
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
