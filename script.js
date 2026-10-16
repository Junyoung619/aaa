// 등록된 일정 목록을 담을 배열 (엑셀 표의 행 데이터 모음)
let ddayList = [];

// 페이지가 로드될 때 기존 저장된 목록 불러오기
window.onload = function() {
    const savedList = localStorage.getItem('myDdayList');
    if (savedList) {
        ddayList = JSON.parse(savedList);
        renderDdayList(); // 화면에 목록 그려주기
    }
};

// 새로운 일정 추가 함수
function addDday() {
    const titleInput = document.getElementById('eventTitle').value.trim();
    const dateInput = document.getElementById('targetDate').value;

    if (!titleInput || !dateInput) {
        alert("일정 제목과 목표 날짜를 모두 입력해주세요!");
        return;
    }

    // 오늘 날짜 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateInput);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        alert("과거 날짜는 선택할 수 없습니다. 오늘 이후 날짜를 선택해주세요.");
        return;
    }

    // 새로운 데이터 객체 생성 (엑셀의 한 행 데이터)
    const newItem = {
        id: Date.now(), // 고유한 ID 값
        title: titleInput,
        date: dateInput
    };

    // 배열에 추가 후 저장
    ddayList.push(newItem);
    saveAndRender();

    // 입력창 초기화
    document.getElementById('eventTitle').value = '';
    document.getElementById('targetDate').value = '';
}

// 특정 일정 삭제 함수
function deleteDday(id) {
    ddayList = ddayList.filter(item => item.id !== id);
    saveAndRender();
}

// 로컬 스토리지 저장 및 화면 갱신
function saveAndRender() {
    localStorage.setItem('myDdayList', JSON.stringify(ddayList));
    renderDdayList();
}

// 화면에 목록 카드를 그려주는 함수
function renderDdayList() {
    const listContainer = document.getElementById('ddayList');
    listContainer.innerHTML = '';

    if (ddayList.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #94a3b8;">등록된 일정이 없습니다. 일정을 추가해보세요!</p>';
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ddayList.forEach(item => {
        const target = new Date(item.date);
        target.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

        let ddayText = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;
        let isWarning = diffDays > 0 && diffDays <= 10; // 10일 이내 마감 임박 표시

        const itemCard = document.createElement('div');
        itemCard.className = `dday-item ${isWarning ? 'warning' : ''}`;

        itemCard.innerHTML = `
            <div class="info-box">
                <div class="item-title">${item.title} ${isWarning ? '⚠️' : ''}</div>
                <div class="item-date">${item.date}</div>
            </div>
            <div class="count-box">
                <span class="dday-badge">${ddayText}</span>
                <button class="delete-btn" onclick="deleteDday(${item.id})">✖</button>
            </div>
        `;

        listContainer.appendChild(itemCard);
    });
}