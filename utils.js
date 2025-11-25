const createTableHeader = () => {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    { text: "이관 번호", widthClass: "w-28" },
    { text: "확인 필요 가이드", widthClass: "w-2/5" },
    { text: "필요 증빙", widthClass: "w-2/5" },
  ];

  headers.forEach(({ text, widthClass }) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.className = `border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium ${widthClass}`;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  return thead;
};

export const createGuideLink = (guide, guideLink) => {
  if (!guide || !guideLink) {
    return null;
  }

  const a = document.createElement("a");
  a.href = guideLink;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = guide;
  a.className = "text-blue-600 hover:underline";

  return a;
};

export const createEvidenceList = (evidenceList) => {
  if (!evidenceList || evidenceList.length === 0) {
    return null;
  }

  const ul = document.createElement("ul");
  ul.className = "list-disc pl-5 space-y-1";

  evidenceList.forEach(({ name, link }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = name;
    a.className = "text-blue-600 hover:underline";
    li.appendChild(a);
    ul.appendChild(li);
  });

  return ul;
};

const createTableBody = (rows) => {
  const tbody = document.createElement("tbody");

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "border-t border-gray-200";

    // 이관 번호
    const noTd = document.createElement("td");
    noTd.textContent = String(row.no);
    noTd.className = "px-3 py-2 border border-gray-100 align-top";
    tr.appendChild(noTd);

    // 확인 필요 가이드 (링크)
    const guideTd = document.createElement("td");
    guideTd.className = "px-3 py-2 border border-gray-100 align-top";
    const guideEl = createGuideLink(row.guide, row.guideLink);
    if (guideEl) {
      guideTd.appendChild(guideEl);
    }
    tr.appendChild(guideTd);

    // 필요 증빙
    const evidenceTd = document.createElement("td");
    evidenceTd.className = "px-3 py-2 border border-gray-100 align-top";

    const evidenceListEl = createEvidenceList(row.evidenceList);
    if (evidenceListEl) {
      evidenceTd.appendChild(evidenceListEl);
    } else {
      evidenceTd.textContent = "-";
    }

    tr.appendChild(evidenceTd);
    tbody.appendChild(tr);
  });

  return tbody;
};

export const renderDropdown = (dropdownEl, list) => {
  dropdownEl.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "전체";
  dropdownEl.appendChild(allOption);

  list.forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    dropdownEl.appendChild(option);
  });
};

export const renderTable = (tableEl, rows) => {
  tableEl.innerHTML = "";
  const thead = createTableHeader();
  const tbody = createTableBody(rows);
  tableEl.appendChild(thead);
  tableEl.appendChild(tbody);
};

export const getBusinessDaysFrom = (startDate, endDate = new Date()) => {
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  if (end <= start) {
    return 0;
  }

  let count = 0;
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
  }

  return count;
};

export const getRequestPeriodLabel = (businessDays) => {
  if (businessDays < 5) {
    return "미도래";
  }
  if (businessDays <= 11) {
    return "가능";
  }
  return "불가능";
};

export const getRequestPeriodText = (date, today = new Date()) => {
  const businessDays = getBusinessDaysFrom(date, today);
  return getRequestPeriodLabel(businessDays);
};

export const filterRowsByNo = (rows, no) => rows.filter((row) => row.no === no);
