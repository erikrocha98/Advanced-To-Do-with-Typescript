import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import { TodoListControllerContext } from './todoListController';
import { useNavigate } from 'react-router-dom';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import TodoListStyles from './todoListStyles';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, TextField, InputAdornment, } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ITodo } from '../../api/todoSch';
import { todoApi } from '../../api/todoApi';
import Divider from '@mui/material/Divider';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

const TodoListView = () => {
	const [open, setOpen] = useState<boolean>(false);
	const controller = React.useContext(TodoListControllerContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const [tarefas, setTarefas] = useState<ITodo[]>([]);
	const [search, setSearch] = useState<string>('');
	
	const {
		Container,
		LoadingContainer,
		SearchContainer
	} = TodoListStyles;

	const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	useEffect(() => {
		const timeout = setTimeout(() => {
			todoApi.searchTask(search, (error: any, result: ITodo[]) => {
				if (error) {
					console.error('Erro na busca de tarefas:', error);
				} else {
					setTarefas(result);
				}
			});
		}, 1000); // debounce de 300ms

		return () => clearTimeout(timeout);
	}, [search]);

	useEffect(() => {
		if (search === '') {
			todoApi.showAllTasks((error, result) => {
				if (error) {
					console.error('Erro ao carregar as tarefas:', error);
				} else {
					setTarefas(result);
				}
			});
		}
	}, [search]);

	return (
		<Container>
			<Typography variant="h5">Lista de Tarefas</Typography>
			<SearchContainer>
				<TextField
					value={search}
					onChange={(e)=>setSearch(e.target.value)}
					placeholder="Pesquisar tarefa"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}

				/>
			</SearchContainer>
			{controller.loading ? (
				<LoadingContainer>
					<CircularProgress />
					<Typography variant="body1">Aguarde, carregando informações...</Typography>
				</LoadingContainer>
			) : (
				<Box sx={{ width: '100%' }}>
					<List sx={{ width: '100%', maxWidth: 600 }}>
						<ListItem
							secondaryAction={
								<IconButton onClick={() => setOpen(!open)} edge="start">
									{open ? <ExpandLess /> : <ExpandMore />}
								</IconButton>
							}
						>

							<ListItemText
								primary={
									<Typography variant="h6">Total de Tarefas ({tarefas.length})</Typography>
								}
							/>
						</ListItem>

						<Collapse in={open} timeout="auto" unmountOnExit>
							{tarefas.map((tarefa: ITodo) => (
								<Box key={tarefa._id}>
									<Divider />
									<ListItem key={tarefa._id}>
										<ListItemIcon>
											<Checkbox
												edge="start"
												tabIndex={-1}
												icon={<RadioButtonUncheckedIcon />}
												checkedIcon={<CheckCircleIcon />}
												checked={!!tarefa.statusTask}
												onChange={async (e) => {
													const novoStatus = e.target.checked;
													const idTarefa = tarefa._id?.toString() ?? '';

													// Atualiza no backend
													await controller.onChangeCheckbox(idTarefa, novoStatus);

													// Atualiza no frontend (estado local)
													setTarefas((prev) =>
														prev.map((t) =>
															t._id === idTarefa ? { ...t, statusTask: novoStatus } : t
														)
													);
												}}
											/>

										</ListItemIcon>
										<ListItemIcon>
											{!tarefa.statusTask? <AssignmentOutlinedIcon />: <AssignmentTurnedInOutlinedIcon/>}
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography sx={{ textDecoration: tarefa.statusTask ? 'line-through' : 'none' }}>
													{tarefa.description}
												</Typography>
											} secondary={tarefa.createdby || "desconhecido"} />
										<IconButton onClick={() => controller.onEditButtonClick(tarefa)}>
											<EditNoteIcon />
										</IconButton>
										<IconButton onClick={() => {
											const idTarefa = tarefa._id?.toString() ?? '';
											controller.onDeleteTask(idTarefa, tarefa);
											// Atualiza no frontend (estado local)
											setTarefas((prev) =>
												prev.filter((t) => t._id !== idTarefa)
											);
										}} sx={{ color: "#f44336" }}>
											<DeleteIcon />
										</IconButton>


									</ListItem>
									<Divider />
								</Box>
							))}

						</Collapse>

					</List>
				</Box>
			)}

			<SysFab
				variant="extended"
				text="Adicionar"
				startIcon={<SysIcon name={'add'} />}
				fixed={true}
				onClick={controller.onAddButtonClick}
			/>
		</Container>
	);
};

export default TodoListView;



/* usuario? usuario.username: "" */