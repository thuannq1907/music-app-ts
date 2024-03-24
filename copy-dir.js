const fs = require("fs-extra");

// sourceDirectory -> thư mục cần copy
// targetDirectory -> thư mục cần dán vào
const listFolderCopy = [
  {
    sourceDirectory: "views",
    targetDirectory: "dist/views"
  },
  {
    sourceDirectory: "public",
    targetDirectory: "dist/public"
  }
];

listFolderCopy.forEach(item => {
  // fs.copy('đường dẫn cần copy', 'đường dẫn cần dán vào')
  fs.copy(item.sourceDirectory, item.targetDirectory, (err) => {
    if (err) {
      console.error(`Lỗi sao chép thư mục ${item.sourceDirectory}:`, err);
    } else {
      console.log(`Sao chép thành công thư mục ${item.sourceDirectory}`);
    }
  });
});