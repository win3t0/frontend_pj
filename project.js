// 드래그 이벤트트
function drag(event) {
    event.dataTransfer.setData("text", event.target.dataset.index);
}

function allowDrop(event) {
    event.preventDefault();
}

// =================================================================================

// 카테고리 버튼 클릭 이벤트
document.querySelectorAll(".category_btn").forEach(btn => {
    btn.addEventListener("click", () => renderMenu(btn.dataset.category));
});

// =================================================================================

// 메뉴 데이터: 메뉴 이름, 가격, 설명, 이미지 경로
const menuData = [
    { category: "beverage", name: "아이스<br>아메리카노", price: 2500, image: "IceAmericano.jpg" },
    { category: "beverage", name: "아메리카노", price: 2000, image: "HotAmericano.jpg" },
    { category: "food", name: "마카롱", price: 2500, image: "macaron.jpg" },
    { category: "food", name: "쿠키", price: 1500, image: "cookie.jpg" }
];

// HTML 요소 가져오기(메뉴,장바구니)
const menuArea = document.getElementById("menu_area");
const cartItems = document.getElementById("cart_items");
// =================================================================================
// 계산, 영수증증
const totalPrice = document.getElementById("total_price");
const receiptModal = document.getElementById("receipt_modal");
const receiptContent = document.getElementById("receipt_content");
const closeReceiptButton = document.getElementById("close_receipt");
const payment = document.getElementById("payment");

// =================================================================================


// 초기 메뉴 렌더링
renderMenu("all");

// 메뉴 렌더링 함수
function renderMenu(category) {
    menuArea.innerHTML = "";
    const filteredMenu = category === "all" ? menuData : menuData.filter(item => item.category === category);

    // 각 메뉴 아이템 생성
    filteredMenu.forEach((item, index) => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu_item");
        menuItem.setAttribute("draggable", "true");
        menuItem.dataset.index = index;
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₩${item.price}</p>
        `;
        menuItem.addEventListener("dragstart", drag);
        menuArea.appendChild(menuItem);
    });
}

// =================================================================================

// 장바구니 데이터
const cart = {};

// 드래그 후 장바구니에 추가
function drop(event) {
    event.preventDefault();
    const index = event.dataTransfer.getData("text");
    const menuItem = menuData[index];
    addCart(menuItem);
}

// 장바구니 추가 함수
function addCart(menuItem) {
    if (cart[menuItem.name]) {
        cart[menuItem.name].count++;
    } else {
        cart[menuItem.name] = { ...menuItem, count: 1 };
    }
    renderCart();
}

// 장바구니 렌더링
function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;
    for (const key in cart) {
        const item = cart[key];
        const cartItem = document.createElement("div");
        cartItem.textContent = `${item.name} x${item.count} - ₩${item.price * item.count}`;
        cartItems.appendChild(cartItem);
        total += item.price * item.count;
    }
    totalPrice.textContent = total;
}


// 장바구니 추가 함수 (업데이트: 수량 조절 버튼 포함)
function addCart(menuItem) {
    if (cart[menuItem.name]) {
        cart[menuItem.name].count++;
    } else {
        cart[menuItem.name] = { ...menuItem, count: 1 };
    }
    renderCart();
}

// 장바구니 렌더링 함수 (업데이트: +, - 버튼 추가)
function renderCart() {
    cartItems.innerHTML = ""; // 기존 장바구니 초기화
    let total = 0;

    for (const key in cart) {
        const item = cart[key];
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <span>${item.name} - ₩${item.price * item.count}</span>
            <div class="count_controls">
                <button class="count_btn" data-name="${item.name}" data-action="decrease">-</button>
                <span>${item.count}</span>
                <button class="count_btn" data-name="${item.name}" data-action="increase">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.count;
    }

    totalPrice.textContent = total;

    // +, - 버튼에 이벤트 리스너 추가
    document.querySelectorAll(".count_btn").forEach(btn => {
        btn.addEventListener("click", handleCountModificate);
    });
}

// 수량 변경 함수
function handleCountModificate(event) {
    const itemName = event.target.dataset.name;
    const action = event.target.dataset.action;

    if (cart[itemName]) {
        if (action === "increase") {
            cart[itemName].count++;
        } else if (action === "decrease") {
            cart[itemName].count--;
            if (cart[itemName].count === 0) {
                delete cart[itemName];
            }
        }
        renderCart(); // 장바구니 갱신
    }
}

// =================================================================================

// 결제 및 영수증 표시
payment.addEventListener("click", () => {
    let receiptHTML = "<h2>결제 내역</h2><ul>";
    let total = 0;

    for (const key in cart) {
        const item = cart[key];
        receiptHTML += `<li>${item.name} x${item.count} - ₩${item.price * item.count}</li>`;
        total += item.price * item.count;
    }
    receiptHTML += `</ul><p class="total-amount">총 합계: ₩${total}</p>`;
    receiptContent.innerHTML = receiptHTML;

    receiptModal.classList.remove("hidden"); // 모달 표시
});

// 화면 초기화
function resetScreen() {
    receiptContent.innerHTML = "";
    receiptModal.classList.add("hidden");
}

// 영수증 닫기 버튼
closeReceiptButton.addEventListener("click", () => {
    resetScreen(); // 초기화 함수 호출
});