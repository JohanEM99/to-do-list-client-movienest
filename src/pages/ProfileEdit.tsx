import React, { useState } from "react";

const ProfileEdit: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Aquí puedes conectar con tu API para guardar los cambios
		// Por ahora mostramos un mensaje simple
		alert("Perfil guardado (simulado)");
	};

	return (
		<div className="profile-edit-container">
			<h2>Editar perfil</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name">Nombre</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Tu nombre"
					/>
				</div>

				<div>
					<label htmlFor="email">Correo</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="tu@ejemplo.com"
					/>
				</div>

				<button type="submit">Guardar</button>
			</form>
		</div>
	);
};

export default ProfileEdit;

