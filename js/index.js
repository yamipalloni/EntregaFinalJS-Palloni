let lunchCalc = document.getElementById("lunchCalc");

// cuando se aprieta enviar, solo si es mayor de 18 años se permitirá la fx calcExpenses
lunchCalc.addEventListener("submit", function (e) {
    e.preventDefault();

    let botonEnviar = document.getElementById("botonEnviar");

    const EDAD = 18;

    botonEnviar.addEventListener("click", () => {
        Swal.fire({
            title: "¿Cuál es tu edad?",
            html: `
            <input type="text" id="edad" class="swal2-input" placeholder="ingresa tu edad">
        `,
            confirButtonText: "enviar",
            showCancelButton: true,
            cancelButtonText: "cancelar"
        }).then((result) => {
            const EDAD_SW = document.getElementById("edad").value;

            if (EDAD_SW >= EDAD) {
                calcExpenses(e);
            }
            else {
                Swal.fire({
                    title: '¡Debes ser mayor de 18 años!',
                    allowOutsideClick: () => {
                        const popup = Swal.getPopup()
                        popup.classListNaNpxove('swal2-show')
                        setTimeout(() => {
                            popup.classList.add('animate__animated', 'animate__headShake')
                        })
                        setTimeout(() => {
                            popup.classListNaNpxove('animate__animated', 'animate__headShake')
                        }, 500)
                        return false
                    },
                })
            }
        })
    })
})

// Guardo cada valor en una variable
function getValues() {
    let tipoEvento = document.getElementById("tipoEvento").value;
    let budget = document.getElementById("budget").value;
    let date = document.getElementById("date").value;
    let people = document.getElementById("people").value;
    let comentarios = document.getElementById("comentarios").value;

    return { tipoEvento, budget, date, people, comentarios };
}

// Reseteo form para que pueda volver a calcularse
function resetForm() {
    document.getElementById("tipoEvento").value = '';
    document.getElementById("budget").value = '';
    document.getElementById("date").value = '';
    document.getElementById("people").value = '';
    document.getElementById("comentarios").value = '';
}

// Guardo los datos del formulario en localStorage
function saveFormData() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();
    const formData = { tipoEvento, budget, date, people, comentarios };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Recupero los datos del formulario de localStorage
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        document.getElementById("tipoEvento").value = formData.tipoEvento;
        document.getElementById("budget").value = formData.budget;
        document.getElementById("date").value = formData.date;
        document.getElementById("people").value = formData.people;
        document.getElementById("comentarios").value = formData.comentarios;
    }
}


function resetUI() {
    let result = document.getElementById("result");
    result.innerHTML = '';
}

function UI(tipoEvento, expenses, people) {
    resetUI();
    let result = document.getElementById("result");
    let dataPrint = document.createElement("div");

    dataPrint.innerHTML = `
    <div class="container-data row">
        <div class="col s4">
            <h6>${tipoEvento}</h6>
        </div>
        <div class="col s4">
            <h6>${expenses}</h6>
        </div>
        <div class="col s4">
            <h6>${people}</h6>
        </div>
    </div>`;

    result.appendChild(dataPrint);

}


// Objeto con presupuesto
class Presupuesto {
    constructor(tipoEvento, people, expenses) {
        this.tipoEvento = tipoEvento;
        this.people = people;
        this.expenses = expenses;
    }
}

// Array 
const PRESUPUESTOS = [];

const CONTENEDOR_PRESUPUESTOS = document.getElementById('presupuestoContainer');

// Función para crear una card y darle la info
function agregarTarjetasPresupuesto(presupuestos) {
    // Limpio el contenedor antes de agregar nuevas tarjetas
    CONTENEDOR_PRESUPUESTOS.innerHTML = '';

    presupuestos.forEach(presupuesto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>Presupuesto para: ${presupuesto.tipoEvento}</h2>
            <p>Personas: ${presupuesto.people}</p>
            <p>Precio: ${presupuesto.expenses}</p>
        `;

        CONTENEDOR_PRESUPUESTOS.appendChild(card);
    });
}

// Guardo los presupuestos en localStorage
function savePresupuestos() {
    localStorage.setItem('presupuestos', JSON.stringify(PRESUPUESTOS));
}

// Recupero los presupuestos de localStorage
function loadPresupuestos() {
    const presupuestosData = JSON.parse(localStorage.getItem('presupuestos'));
    if (presupuestosData) {
        PRESUPUESTOS.push(...presupuestosData);
        agregarTarjetasPresupuesto(PRESUPUESTOS);
    }
}

// Inicializar con las tarjetas de presupuesto predefinidas
agregarTarjetasPresupuesto(PRESUPUESTOS);


// Funcion de la calculadora
function calcExpenses() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();

    let costoPorPersona = 500;
    let expenses = parseInt(people) * costoPorPersona;

    // Ciclo para asegurar que el presupuesto sea suficiente
    let validBudget = parseInt(budget);
    while (validBudget < expenses) {
        validBudget = parseInt(
            Swal.fire({
                title: 'El presupuesto es insuficiente.',
                text: `El costo del evento es ${expenses}. Por favor ingresa un presupuesto mayor o igual.`, 
                icon: 'error',
                allowOutsideClick: () => {
                    const popup = Swal.getPopup()
                    popup.classListNaNpxove('swal2-show')
                    setTimeout(() => {
                        popup.classList.add('animate__animated', 'animate__headShake')
                    })
                    setTimeout(() => {
                        popup.classListNaNpxove('animate__animated', 'animate__headShake')
                    }, 500)
                    return false
    }})
    )}

    let balance = validBudget - expenses;

    console.log(`El tipo de evento es ${tipoEvento}, para ${people} personas y cuesta ${expenses}. Tu presupuesto es ${validBudget}`);

    // Llevo la data a la UI para aplicar luego el resto
    UI(tipoEvento, expenses, people, comentarios);

    // Creo una nueva instancia de Presupuesto y la agrego al array
    let nuevoPresupuesto = new Presupuesto(tipoEvento, people, expenses);
    PRESUPUESTOS.push(nuevoPresupuesto);

    // Actualizo las tarjetas de presupuesto
    agregarTarjetasPresupuesto(PRESUPUESTOS);

    savePresupuestos(); // Guardo presupuestos en localStorage
    resetForm(); // Limpio el formulario para un nuevo cálculo
    saveFormData(); // Guardo datos del formulario en localStorage
}

// Cargo los datos guardados al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadFormData(); // Cargar los datos del formulario guardados
    loadPresupuestos(); // Cargar los presupuestos guardados
});



