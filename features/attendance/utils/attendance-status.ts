export const playerAttendanceStatus = (type: string) => {
  switch (type) {
    case "ATTENDING":
      return "Present";
    case "NOT_ATTENDING":
      return "Absent";
    case "LATE":
      return "Late";
    default:
      return "";
  }
};

export const playerAttendanceStatusColor = (type: string) => {
  switch (type) {
    case "ATTENDING":
      return "bg-green-300 text-green-800";
    case "NOT_ATTENDING":
      return "bg-red-300 text-red-800";
    case "LATE":
      return "bg-yellow-300 text-yellow-800 ";
    default:
      return "text-gray-400";
  }
};
