// 테이블 헤더 생성
const createTableHeader = () => {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    { text: "이관 번호", className: "col-no" },
    { text: "확인 필요 가이드", className: "col-guide" },
    { text: "필요 증빙", className: "col-evidence" },
  ];

  headers.forEach(({ text, className }) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.className = className;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  return thead;
};

// 가이드 링크 생성
export const createGuideLink = (guide, guideLink) => {
  if (!guide || !guideLink) {
    return null;
  }

  const a = document.createElement("a");
  a.href = guideLink;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = guide;
  a.className = "link";

  return a;
};

// 증빙 목록 생성
export const createEvidenceList = (evidenceList) => {
  if (!evidenceList || evidenceList.length === 0) {
    return null;
  }

  const ul = document.createElement("ul");
  ul.className = "evidence-list";

  evidenceList.forEach(({ name, link }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = name;
    a.className = "link";
    li.appendChild(a);
    ul.appendChild(li);
  });

  return ul;
};

// 테이블 바디 생성
const createTableBody = (rows) => {
  const tbody = document.createElement("tbody");

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    // 이관 번호
    const noTd = document.createElement("td");
    noTd.textContent = String(row.no);
    tr.appendChild(noTd);

    // 확인 필요 가이드 (링크)
    const guideTd = document.createElement("td");
    const guideEl = createGuideLink(row.guide, row.guideLink);
    if (guideEl) {
      guideTd.appendChild(guideEl);
    }
    tr.appendChild(guideTd);

    // 필요 증빙
    const evidenceTd = document.createElement("td");

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

// 드롭다운 렌더링
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

// 테이블 렌더링
export const renderTable = (tableEl, rows) => {
  tableEl.innerHTML = "";
  const thead = createTableHeader();
  const tbody = createTableBody(rows);
  tableEl.appendChild(thead);
  tableEl.appendChild(tbody);
};

// 영업일 계산
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

// 쿠팡확인요청 접수 기간 라벨 계산
export const getRequestPeriodLabel = (businessDays) => {
  if (businessDays < 5) { // 5영업일 이전
    return "미도래";
  }
  if (businessDays <= 11) { // 11영업일 이전  
    return "가능";
  }
  return "불가능";
};

// 쿠팡확인요청 접수 기간 텍스트 계산
export const getRequestPeriodText = (date, today = new Date()) => {
  const businessDays = getBusinessDaysFrom(date, today);
  return getRequestPeriodLabel(businessDays);
};

// 이관글 번호 필터링
export const filterRowsByNo = (rows, no) => rows.filter((row) => row.no === no);

