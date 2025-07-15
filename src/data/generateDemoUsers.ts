export default function generateDemoUsers(count = 100) {
  const roles = ["user", "merchant", "admin"];
  const statuses = ["pending", "waiting", "success"];
  const names = [
    "Sagar Roy",
    "John Doe",
    "Jane Smith",
    "Alice Brown",
    "Bob Johnson",
    "Charlie Lee",
    "Emily Davis",
    "Frank Miller",
    "Grace Wilson",
    "Harry Moore",
    "Ivy Taylor",
    "Jack White",
    "Karen Young",
    "Leo Green",
    "Mia Hall",
    "Nathan Adams",
    "Olivia Clark",
    "Peter Lewis",
    "Quincy Walker",
    "Rachel Scott",
    "Samuel King",
    "Tina Wright",
    "Umar Allen",
    "Vera Hill",
    "Will Baker",
    "Xander Cox",
    "Yasmin Ward",
    "Zack Brooks",
    "Ava Wood",
    "Ben Morris",
    "Clara Price",
    "Derek Reed",
    "Ella Simmons",
    "Finn Turner",
    "Gia Foster",
    "Hank Howard",
    "Isla Bryant",
    "Jake Barnes",
    "Kylie Ross",
    "Liam Powell",
  ];

  const demoUsers = Array.from({ length: count }, (_, i) => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomPhone =
      "01" +
      Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(10, "0");

    return {
      id: i + 1,
      name: randomName,
      status: randomStatus,
      created: "12-12-2024",
      phone: randomPhone,
      verified: Math.random() < 0.8,
      role: randomRole,
    };
  });

  return demoUsers;
}
