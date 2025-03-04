let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];
let total = parseFloat(localStorage.getItem('shoppingTotal')) || 0;



document.addEventListener('DOMContentLoaded', () => {
    updateList();
    updateTotal();
});


function addItem() {
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const quantityInput = document.getElementById('itemQuantity');
    
    // Validación
    if (!nameInput.value || !quantityInput.value) {
        alert('Por favor completa todos los campos');
        return;
    }

    const item = {
        id: Date.now(),
        name: nameInput.value,
        price: parseFloat(priceInput.value),
        quantity: parseInt(quantityInput.value),
        total: 0
    };

    if ( item.price === "" || isNaN(item.price)) {    
        item.price = 0
      }
    //if (item.price == null || item.price == '' ){ item.price = 0}
    console.log(item.price)
    item.total = item.price * item.quantity;
    items.push(item);
    total += item.total;

    //console.log(item)
    saveToLocalStorage();
    updateList();
    updateTotal();
    clearInputs();
}

function updateList() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';

    items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
            <span>${item.name}</span>
            <span><input type="number" value="${item.quantity}"> x $ <input type="number" id="${item.id}" value="${item.price}"></span>
            <span>$${item.total}</span>
            <button onclick="removeItem(${item.id})" class="clear">🗑️</button>
        `;
        list.appendChild(li);
    });
    const listainput = document.getElementsByClassName('item');
    for (let i = 0; i < listainput.length; i++) {
        const input = listainput[i];
        input.addEventListener('input', function(e) {
           /* console.log(`El valor actual es: ${e.target.value}`);*/
           
            let xId = this.children[1].children[1].id
            let xName = this.children[0].textContent 
            let xCant= this.children[1].children[0].value
            let xPrice= this.children[1].children[1].value
            let xTotal = xCant * xPrice 
            this.children[2].innerHTML = xTotal
            /* item.total = item.price * item.quantity;
            items.push(item);
            total += item.total; */
            const item = {
                id : xId,
                name: xName,
                price: xPrice,
                quantity: xCant,
                total: xTotal
            };
            //console.log(item)
            localStorage.setItem('shoppingItems', JSON.stringify(item));
        });

    }

}

function removeItem(id) {
    items = items.filter(item => {
        if (item.id === id) {
            total -= item.total;
            return false;
        }
        return true;
    });
    
    saveToLocalStorage();
    updateList();
    updateTotal();
}

function clearList() {
    if (confirm('¿Estás seguro de querer borrar toda la lista?')) {
        items = [];
        total = 0;
        localStorage.removeItem('shoppingItems');
        localStorage.removeItem('shoppingTotal');
        updateList();
        updateTotal();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
    localStorage.setItem('shoppingTotal', total.toString());
}

function updateTotal() {
    document.getElementById('totalAmount').textContent = 
        `Total: $${total.toFixed(2)}`;
}

function clearInputs() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemQuantity').value = '1';
}

function shareList() {
    if (items.length === 0) {
        alert('La lista está vacía');
        return;
    }

    let listText = '📝 Lista de Compras:\n\n';
    items.forEach(item => {
        listText += `✔ ${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}\n`;
    });
    listText += `\n💰 Total: $${total.toFixed(2)}`;

    // Usar Web Share API si está disponible
    if (navigator.share) {
        navigator.share({
            title: 'Mi Lista de Compras',
            text: listText
        }).catch(console.error);
    } else {
        // Fallback para copiar al portapapeles
        navigator.clipboard.writeText(listText);
        alert('Lista copiada al portapapeles! 📋');
    }
}