import * as XLSX from 'xlsx';

self.onmessage = async (e) => {
  const { files, folder, filters } = e.data;
  const { pgp, evento } = filters;

  let allContracts = [];
  let seenContracts = new Set();

  await Promise.all(Array.from(files).map(async (file) => {
    const fileName = file.webkitRelativePath.toLowerCase();
    const shouldInclude = (pgp && fileName.includes('pgp')) || (evento && !fileName.includes('pgp'));

    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
      if (shouldInclude && !seenContracts.has(fileName)) {
        seenContracts.add(fileName);
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });

        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (json.length > 0) {
            const headers = json[0] || [];
            const dataWithoutHeaders = json.slice(1);

            allContracts.push({
              fileName: file.webkitRelativePath,
              folder: folder,
              headers: headers,
              data: dataWithoutHeaders
            });
          }
        });
      }
    }
  }));

  self.postMessage(allContracts);
};
