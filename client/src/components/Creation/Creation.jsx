import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DropDownList from '../DropDownList/DropDownList';
import ListDisplayer from '../ListDisplayer/ListDisplayer';
import style from './Creation.module.css';
import {get_genres, get_consoles} from '../../redux/actions';

const Creation = () => {
	//variables
	const [input, setInput] = useState({
		name:"",
		description:"",
		consoles:[],
		rating:-1,
		launch_date: '',
		genres: []
	});
	const genres = useSelector(state => state.genres);
	const consoles = useSelector(state => state.consoles)
	const [newConsole, setNewConsole] = useState('');
	const [newGenre, setNewGenre] = useState('')
	const [nameError, setNameError] = useState('');
	const [dateError, setDateError] = useState('');
	const [consoleError, setConsoleError] = useState('');
	const [genresError, setGenresError] = useState('')
	const [consolesError, setConsolesError] = useState('');
	const [errorList, setErrorList] = useState([]);
	const [sent, setSent] = useState('');
	//methods
	const dispatch = useDispatch();
	const inputHandler = (event) => {
		setInput({
			...input,
			[event.target.name]:event.target.value
		});
	};

	const ratingHandler = (event) => {
		const result = Math.ceil(event.target.value/10);
		setInput({
			...input, 
			rating: result
		});
	};


	const genresHandler = (value) => {
		if (!input.genres.includes(value)) setInput({...input, genres:[...input.genres, value]})
		else {
			let genresCopy = input.genres;
			genresCopy = genresCopy.filter(genre => genre !== value);
			setInput({...input, genres: genresCopy})
		}
	};

	const consolesHandler = (value) => {
		if (!input.consoles.includes(value)) setInput({...input, consoles:[...input.consoles, value]})
		else {
			let consolesCopy = input.consoles;
			consolesCopy = consolesCopy.filter(console => console !== value);
			setInput({...input, consoles: consolesCopy})
		}
	};

	const newConsoleHandler = (event) => {
		setNewConsole(event.target.value);
	};

	const newGenreHandler = (event) => {
		setNewGenre(event.target.value);
	};

	const nameErrorHandler = () => {
		if(input.name.length > 30) setNameError('Nombre demasiado largo (Límite: 30 caracteres)');
		if(input.name === '') setNameError('Campo de nombre obligatorio');
		else setNameError('');
	};

	const dateErrorHandler = () => {
		const now = new Date();
		const [year, month, day] = input.launch_date.split('-');
		const date = new Date(`${year}-${month}-${parseInt(day)+1}`);
		now.setHours(0,0,0,0);
		date.setHours(0,0,0,0);
		if(date > now || input.launch_date === '') setDateError('Por favor, ingresa una fecha válida');
		else setDateError('');
	}

	const consolesErrorHandler = () => { 
		if(!input.consoles.length) setConsolesError('Campo de plataformas obligatorio');
		else setConsolesError('');
	};
	
	const handleConsoleClickDown = () => {
		const value = newConsole;
		if(!input.consoles.map(console => console.toLowerCase()).includes(value.toLowerCase())){
			if(/^[a-z0-9]+$/.test(value)) {
				consolesHandler(value);
				setConsoleError('');
			}
			else setConsoleError('Plataforma invalida. Por favor solo usa valores alfanumericos')
		}
		else {
			consolesHandler(value);
			setConsoleError('');
		}
	};

	const handleGenreClickDown = () => {
		const value = newGenre;
		if(!input.genres.map(genre => genre.toLowerCase()).includes(value.toLowerCase())){
			if(/^[a-z0-9]+$/.test(value)) {
				genresHandler(value);
				setGenresError('');
			}
			else setGenresError('Plataforma invalida. Por favor solo usa valores alfanumericos')
		}
		else {
			genresHandler(value);
			setGenresError('');
		}
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		const Response = await fetch('http://localhost:3001/videogames', {
			method: 'POST',
			headers:{
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(input)
		});
		const content = await Response.json();
		if(!content.error_message){
			setSent("Enviado!");
			setInput({
				name:"",
				description:"",
				consoles:[],
				rating:-1,
				launch_date: '',
				genres: []
			});
			console.log('a');
		}
		else setSent(content.error_message);
		
	};

	useEffect(async () => {
		dispatch(get_genres());
		dispatch(get_consoles());
	}, []);

	useEffect(() => {
		nameErrorHandler();
	},[input.name]);

	useEffect(()=>{
		dateErrorHandler();
	}, [input.launch_date]);

	useEffect(()=>{
		consolesErrorHandler();
	}, [input.consoles]);

	useEffect(() => {
		setErrorList([nameError, dateError, consolesError]);
	}, [nameError, dateError, consolesError]);

	return(
		<>
			<div className={style.form}>
				<ul className = {style.error}>{errorList.map(error => error.length?(<li key = {error}>{error}</li>):'')}</ul>
				<form className = {style.game_form} onSubmit = {submitHandler}>
					<label htmlFor = "name">Nombre del juego*: </label>
					<input className = {style.name_input} type = "text" name = "name" value = {input.name} onChange = {inputHandler} />
					<label htmlFor = "description">description del juego*: </label>
					<textarea className = {style.description_input} type = "text" rows = "4" name = "description" value = {input.description} onChange = {inputHandler}></textarea>
					<label htmlFor = "consoles">Launch date*: </label>
					<input className = {style.date_input} type = "date" name = "launch_date" value = {input.launch_date} onChange = {(event) =>{
						inputHandler(event);
						dateErrorHandler();
					}} />
					<label htmlFor = "rating">Rating: </label>
					<input className = {style.rating_input} type = "range" name = "rating" value = {input.rating*10} onChange = {ratingHandler} /> {input.rating >= 0? <span>{input.rating/2}</span>:<span>Califica el juego!</span>}
					<label htmlFor = "consoles">Agrega las plataformas en las que se encuentra el juego*: </label>
					<ListDisplayer name = "Plataformas" setState = {consolesHandler} elements = {input.consoles.join('%')} />
					<input className = {style.tags_input} type = "text" name = "new_platform" value = {newConsole} onChange = {newConsoleHandler}/> <button className = {style.add_button} type = "button" onClick = {handleConsoleClickDown}>Agregar</button>
					<DropDownList splitChar = "%" setState = {consolesHandler} name = "platforms" elements = {consoles.length?consoles.map(console => console.name).join('%'):''} />
					<label htmlFor = "genres">Agrega los géneros del juego: </label>
					<ListDisplayer name = "Géneros" setState = {genresHandler} elements = {input.genres.map(genre => genre).join('%')} />
					<input className = {style.tags_input} type = "text" name = "new_genre" value = {newGenre} onChange = {newGenreHandler}/> <button className = {style.add_button} type = "button" onClick = {handleGenreClickDown}>Agregar</button>
					<DropDownList splitChar = "%" setState = {genresHandler} name = "genres" elements = {genres.map(genre => genre.name).join('%')} />
					<button className = {style.add_button} type="submit" disabled = {!input.name || !input.consoles || !input.description || !errorList.length}>Enviar</button>
				</form>
				<span>{sent.length?"Respuesta enviada exitosamente":null}</span>
			</div>
		</>
	);
};

export default Creation;