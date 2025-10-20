document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos HTML del DOM (variables para mayor eficiencia este evita errores al intentar manipular elementos que aún no existen, 
    // se guardan las variables para que el navehador busque el elemento una vez, luego solo se ref y así se llaman) ---
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const bookingForm = document.querySelector('.booking-form');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');

    const navLoginItem = document.getElementById('nav-login-item');
    const navRegisterItem = document.getElementById('nav-register-item');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.querySelector('.admin-link');
    const logoutLink = document.querySelector('.logout-link');

    const adminPanelSection = document.getElementById('admin-panel');
    const showUsersBtn = document.getElementById('show-users-btn');
    const userListContainer = document.getElementById('user-list-container');
    const usersTableBody = document.querySelector('#users-table tbody');
    const noUsersMessage = document.getElementById('no-users-message');

    const editUserContainer = document.getElementById('edit-user-container');
    const editUserForm = document.getElementById('edit-user-form');
    const editUserEmailHidden = document.getElementById('edit-user-email-hidden');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editMessage = document.getElementById('edit-message');


    // --- Funciones Auxiliares, muestra mensajes con retroalimentación  ---

    // Muestra mensajes en formularios (éxito o error)
    function showMessage(element, message, type) {
        element.textContent = message;
        element.classList.remove('error', 'success');
        if (type) {
            element.classList.add(type);
        }
        element.style.display = 'block';
    }

    // Limpia y oculta mensajes de formularios
    function clearMessage(element) {
        element.textContent = '';
        element.classList.remove('error', 'success');
        element.style.display = 'none';
    }

    // Guarda el array de usuarios en localStorage
    function saveUsers(users) {
        localStorage.setItem('hotelElSolUsers', JSON.stringify(users));
    }

    // Carga el array de usuarios desde localStorage
    function loadUsers() {
        const usersJSON = localStorage.getItem('hotelElSolUsers');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    // Obtiene el usuario logeado de sessionStorage
    function getLoggedInUser() {
        const userJSON = sessionStorage.getItem('hotelElSolLoggedInUser');
        return userJSON ? JSON.parse(userJSON) : null;
    }

    // Establece el usuario logeado en sessionStorage y actualiza la UI
    function setLoggedInUser(user) {
        if (user) {
            sessionStorage.setItem('hotelElSolLoggedInUser', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('hotelElSolLoggedInUser');
        }
        updateUIForAuth();
    }

    // --- Gestión de Interfaz de Usuario (UI) basada en autenticación ---

    // Actualiza la visibilidad de los elementos de navegación y secciones
    function updateUIForAuth() {
        const currentUser = getLoggedInUser();

        if (currentUser) {
            // Usuario logeado: ocultar login/registro, mostrar logout
            navLoginItem.classList.add('hidden');
            navRegisterItem.classList.add('hidden');
            logoutLink.classList.remove('hidden');

            // Mostrar Panel Admin solo si es administrativo
            if (currentUser.userType === 'admin') {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
                adminPanelSection.classList.add('hidden');
            }
        } else {
            // Usuario no logeado: mostrar login/registro, ocultar logout y admin
            navLoginItem.classList.remove('hidden');
            navRegisterItem.classList.remove('hidden');
            logoutLink.classList.add('hidden');
            adminLink.classList.add('hidden');
            adminPanelSection.classList.add('hidden');
        }
    }

    // --- Lógica del Menú Desplegable ---
    if (dropdown && dropdownContent) {
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', () => {
                dropdownContent.style.display = 'block';
            });
            dropdown.addEventListener('mouseleave', () => {
                dropdownContent.style.display = 'none';
            });
        } else {
            dropdown.addEventListener('click', (event) => {
                event.preventDefault();
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });
            document.addEventListener('click', (event) => {
                if (!dropdown.contains(event.target) && !dropdownContent.contains(event.target)) {
                    dropdownContent.style.display = 'none';
                }
            });
        }
    }

    // --- Lógica de la Sección de Reservas ---
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const checkInDate = document.getElementById('check-in').value;
            const checkOutDate = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const inDate = new Date(checkInDate);
            const outDate = new Date(checkOutDate);

            // Validaciones
            if (!checkInDate || !checkOutDate) {
                alert('Por favor, selecciona las fechas de Check-in y Check-out.');
                return;
            }
            if (inDate < today) {
                alert('La fecha de Check-in no puede ser anterior a hoy.');
                return;
            }
            if (outDate <= inDate) {
                alert('La fecha de Check-out debe ser posterior a la fecha de Check-in.');
                return;
            }
            if (parseInt(guests) < 1) {
                alert('El número de huéspedes debe ser al menos 1.');
                return;
            }

            alert('¡Formulario de reserva enviado correctamente! (Simulación. Aquí se procesaría la reserva)');
            bookingForm.reset();
        });
    }

    // --- Lógica de Registro de Usuario ---
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearMessage(registerMessage);

            const name = document.getElementById('reg-name').value.trim();
            const lastname = document.getElementById('reg-lastname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const userType = document.getElementById('reg-user-type').value;

            // Validaciones de campos
            if (!name || !lastname || !email || !phone || !password || !userType) {
                showMessage(registerMessage, 'Todos los campos son obligatorios.', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage(registerMessage, 'La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(registerMessage, 'Por favor, introduce un email válido.', 'error');
                return;
            }
            if (!/^\d{7,15}$/.test(phone)) {
                showMessage(registerMessage, 'El teléfono debe contener entre 7 y 15 dígitos numéricos.', 'error');
                return;
            }

            let users = loadUsers();

            // Verificar si el email ya existe
            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
                showMessage(registerMessage, 'El email ya está registrado. Intenta iniciar sesión.', 'error');
                return;
            }

            const newUser = {
                name,
                lastname,
                email,
                phone,
                password, // ADVERTENCIA: En un entorno REAL, la contraseña DEBE ser hasheada en el backend.
                userType
            };

            users.push(newUser);
            saveUsers(users);
            showMessage(registerMessage, '¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
            registerForm.reset();
        });
    }

    // --- Lógica de Inicio de Sesión ---
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearMessage(loginMessage);

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            let users = loadUsers();

            // Buscar usuario por email y contraseña
            // ADVERTENCIA: En un entorno REAL, la contraseña DEBE ser verificada con un hash seguro desde el backend.
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setLoggedInUser(user);
                showMessage(loginMessage, `¡Bienvenido, ${user.name}!`, 'success');
                loginForm.reset();
                if (user.userType === 'admin') {
                    window.location.hash = '#admin-panel';
                } else {
                    window.location.hash = '#inicio';
                }
            } else {
                showMessage(loginMessage, 'Email o contraseña incorrectos.', 'error');
            }
        });
    }

    // --- Lógica de Cerrar Sesión ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setLoggedInUser(null);
            alert('Has cerrado sesión.');
            window.location.hash = '#inicio';
        });
    }

    // --- Lógica del Panel de Administración ---
    if (showUsersBtn) {
        showUsersBtn.addEventListener('click', () => {
            const currentUser = getLoggedInUser();
            if (!currentUser || currentUser.userType !== 'admin') {
                alert('Acceso denegado. Solo usuarios administrativos pueden ver este panel.');
                window.location.hash = '#inicio';
                return;
            }
            displayUsers();
            userListContainer.classList.remove('hidden');
            editUserContainer.classList.add('hidden');
            clearMessage(editMessage);
        });
    }

    // Función para renderizar la lista de usuarios en la tabla
    function displayUsers() {
        const users = loadUsers();
        usersTableBody.innerHTML = '';

        if (users.length === 0) {
            noUsersMessage.classList.remove('hidden');
            userListContainer.classList.add('hidden');
            return;
        } else {
            noUsersMessage.classList.add('hidden');
            userListContainer.classList.remove('hidden');
        }

        users.forEach(user => {
            const row = usersTableBody.insertRow();
            row.insertCell().textContent = user.name;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.phone;
            row.insertCell().textContent = user.userType === 'admin' ? 'Administrativo' : 'Cliente';

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('btn', 'btn-secondary');
            editButton.addEventListener('click', () => editUser(user.email));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-logout');
            deleteButton.addEventListener('click', () => deleteUser(user.email));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    // Función para cargar los datos de un usuario en el formulario de edición
    function editUser(emailToEdit) {
        const users = loadUsers();
        const userToEdit = users.find(user => user.email === emailToEdit);

        if (userToEdit) {
            userListContainer.classList.add('hidden');
            editUserContainer.classList.remove('hidden');

            document.getElementById('edit-name').value = userToEdit.name;
            document.getElementById('edit-lastname').value = userToEdit.lastname;
            document.getElementById('edit-email').value = userToEdit.email;
            document.getElementById('edit-phone').value = userToEdit.phone;
            document.getElementById('edit-user-type').value = userToEdit.userType;
            document.getElementById('edit-user-email-hidden').value = userToEdit.email;
            clearMessage(editMessage);
        } else {
            alert('Usuario no encontrado para edición.');
        }
    }

    // Manejar el envío del formulario de edición de usuario
    if (editUserForm) {
        editUserForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearMessage(editMessage);

            const originalEmail = document.getElementById('edit-user-email-hidden').value;
            const updatedName = document.getElementById('edit-name').value.trim();
            const updatedLastname = document.getElementById('edit-lastname').value.trim();
            const updatedPhone = document.getElementById('edit-phone').value.trim();
            const updatedUserType = document.getElementById('edit-user-type').value;

            // Validaciones
            if (!updatedName || !updatedLastname || !updatedPhone || !updatedUserType) {
                showMessage(editMessage, 'Todos los campos son obligatorios.', 'error');
                return;
            }
            if (!/^\d{7,15}$/.test(updatedPhone)) {
                showMessage(editMessage, 'El teléfono debe contener entre 7 y 15 dígitos numéricos.', 'error');
                return;
            }

            let users = loadUsers();
            const userIndex = users.findIndex(user => user.email === originalEmail);

            if (userIndex !== -1) {
                users[userIndex].name = updatedName;
                users[userIndex].lastname = updatedLastname;
                users[userIndex].phone = updatedPhone;
                users[userIndex].userType = updatedUserType;
                saveUsers(users);
                showMessage(editMessage, 'Usuario actualizado correctamente.', 'success');
                
                displayUsers();
                editUserContainer.classList.add('hidden');
                userListContainer.classList.remove('hidden');
            } else {
                showMessage(editMessage, 'Error: No se pudo encontrar el usuario para actualizar.', 'error');
            }
        });
    }

    // Manejar el botón de cancelar edición
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editUserContainer.classList.add('hidden');
            userListContainer.classList.remove('hidden');
            clearMessage(editMessage);
        });
    }

    // Función para eliminar un usuario
    function deleteUser(emailToDelete) {
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario con email: ${emailToDelete}?`)) {
            let users = loadUsers();
            const updatedUsers = users.filter(user => user.email !== emailToDelete);
            saveUsers(updatedUsers);
            alert('Usuario eliminado correctamente.');
            displayUsers();
        }
    }

    // --- Smooth scrolling para enlaces de navegación ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                if (window.innerWidth <= 768 && dropdownContent && dropdownContent.style.display === 'block') {
                    dropdownContent.style.display = 'none';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('header').offsetHeight),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Ajuste de offset para el smooth scrolling cuando se recarga la página con un #hash en la URL
    function handleHashChange() {
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - (document.querySelector('header').offsetHeight),
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    // --- Inicialización al cargar la página ---
    updateUIForAuth();
});