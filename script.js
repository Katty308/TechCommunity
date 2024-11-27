class EmergencySystem {
    constructor() {
        this.emergencies = [];
        this.activeEmergencies = 0;
        this.availableResources = 100; // Inicia con 50 recursos
        this.averageResponse = 0; // Inicializa en 0
        this.resourceCosts = {
            medical: 15,  // Recursos para emergencias médicas
            fire: 25,     // Recursos para emergencias de fuego
            security: 10, // Recursos para emergencias de seguridad
            natural: 30   // Recursos para emergencias de desastres naturales
        };

        this.initializeEventListeners();
        this.updateDashboard();
    }

    initializeEventListeners() {
        // Evento para el formulario
        document.getElementById('emergencyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewEmergency();
        });

        // Eventos para los botones de tipo de emergencia
        document.getElementById('medicalBtn').addEventListener('click', () => this.setupEmergencyForm('medical'));
        document.getElementById('fireBtn').addEventListener('click', () => this.setupEmergencyForm('fire'));
        document.getElementById('securityBtn').addEventListener('click', () => this.setupEmergencyForm('security'));
        document.getElementById('naturalBtn').addEventListener('click', () => this.setupEmergencyForm('natural'));

        // Evento para las emergencias ya registradas
        document.getElementById('emergencyList').addEventListener('click', (e) => {
            if (e.target && e.target.matches('button')) {
                const emergencyId = e.target.getAttribute('data-id');
                this.fillEmergencyForm(emergencyId);
            }
        });
    }

    setupEmergencyForm(type) {
        // Reseteamos los valores antes de mostrar el formulario
        this.availableResources = Math.max(this.availableResources, 0); // Aseguramos que los recursos no sean negativos
        this.averageResponse = 0; // Inicializamos el tiempo de respuesta a 0
        document.getElementById('emergencyFormContainer').style.display = 'block';
        document.getElementById('type').value = type;
        this.updateDashboard();
    }

    handleNewEmergency() {
        const type = document.getElementById('type').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const priority = document.getElementById('priority').value;

        // Verificamos si hay suficientes recursos antes de continuar
        if (this.availableResources < this.resourceCosts[type]) {
            alert('No hay suficientes recursos disponibles para registrar esta emergencia');
            return; // Si no hay suficientes recursos, no continuamos
        }

        // Asignamos el tiempo de respuesta y los recursos necesarios según la prioridad
        this.updateResponseTime(priority);
        this.updateAvailableResources(type);

        const emergency = {
            id: Date.now(),
            type,
            location,
            description,
            priority,
            status: 'active',
            timestamp: new Date().toLocaleString()
        };

        this.emergencies.unshift(emergency); // Añadimos la emergencia al principio del array
        this.activeEmergencies++;
        this.updateDashboard();
        this.renderEmergencies();
        this.resetForm();
    }

    updateResponseTime(priority) {
        switch (priority) {
            case 'high':
                this.averageResponse = 5;  // 5 minutos para alta prioridad
                break;
            case 'medium':
                this.averageResponse = 10; // 10 minutos para media prioridad
                break;
            case 'low':
                this.averageResponse = 15; // 15 minutos para baja prioridad
                break;
            default:
                this.averageResponse = 0;
        }
    }

    updateAvailableResources(type) {
        if (this.resourceCosts[type] !== undefined) {
            this.availableResources -= this.resourceCosts[type]; // Restamos los recursos necesarios para esa emergencia
        }
    }

    updateDashboard() {
        document.getElementById('activeEmergencies').textContent = this.activeEmergencies;
        document.getElementById('availableResources').textContent = this.availableResources;
        document.getElementById('averageResponse').textContent = `${this.averageResponse} min`;
    }

    renderEmergencies() {
        const list = document.getElementById('emergencyList');
        list.innerHTML = ''; // Limpiamos la lista antes de agregar nuevas emergencias

        this.emergencies.forEach(emergency => {
            const item = document.createElement('div');
            item.className = `emergency-item status-${emergency.status}`;
            item.innerHTML = `
                <h3>${this.getEmergencyTypeText(emergency.type)}</h3>
                <p><strong>Ubicación:</strong> ${emergency.location}</p>
                <p><strong>Descripción:</strong> ${emergency.description}</p>
                <p><strong>Prioridad:</strong> ${this.getPriorityText(emergency.priority)}</p>
                <p><strong>Reportado:</strong> ${emergency.timestamp}</p>
                <button data-id="${emergency.id}" class="resolveButton">
                    Marcar como Resuelto
                </button>
            `;
            list.appendChild(item);
        });
    }

    resolveEmergency(id) {
        const index = this.emergencies.findIndex(e => e.id === id);
        if (index !== -1) {
            this.emergencies[index].status = 'resolved';
            this.activeEmergencies--;
            this.availableResources += this.resourceCosts[this.emergencies[index].type]; // Añadimos los recursos al resolver
            this.updateDashboard();
            this.renderEmergencies();

            // Refrescar la página después de resolver la emergencia
            setTimeout(() => {
                window.location.reload(); // Recargar la página para mostrar los cambios
            }, 500);
        }
    }

    fillEmergencyForm(id) {
        const emergency = this.emergencies.find(e => e.id === id);
        if (emergency) {
            document.getElementById('type').value = emergency.type;
            document.getElementById('location').value = emergency.location;
            document.getElementById('description').value = emergency.description;
            document.getElementById('priority').value = emergency.priority;
            document.getElementById('emergencyFormContainer').style.display = 'block';
        }
    }

    getEmergencyTypeText(type) {
        const types = {
            medical: 'Emergencia Médica',
            fire: 'Incendio',
            security: 'Emergencia de Seguridad',
            natural: 'Desastre Natural'
        };
        return types[type] || type;
    }

    getPriorityText(priority) {
        const priorities = {
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
        };
        return priorities[priority] || priority;
    }

    resetForm() {
        document.getElementById('emergencyForm').reset();
        document.getElementById('emergencyFormContainer').style.display = 'none'; // Ocultamos el formulario después de enviarlo
    }
}

const emergencySystem = new EmergencySystem();
