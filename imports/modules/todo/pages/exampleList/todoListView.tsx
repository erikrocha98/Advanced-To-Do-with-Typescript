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
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ITodo } from '../../api/todoSch';
import { todoApi } from '../../api/todoApi';
import Divider from '@mui/material/Divider';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';


const TodoListView = () => {
	const [open, setOpen] = useState<boolean>(false);
	const controller = React.useContext(TodoListControllerContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const [tarefas, setTarefas] = useState<ITodo[]>([]);

	const {
		Container,
		LoadingContainer,
		SearchContainer
	} = TodoListStyles;

	const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	useEffect(() => {
		todoApi.showAllTasks((error, result) => {
			if (error) {
				return console.log('erro ao carregar as tarefas')

			} else {
				setTarefas(result);
			}
		});
	}, []);
	const usuario = Meteor.user();

	
	return (
		<Container>
			<Typography variant="h5">Lista de Tarefas</Typography>
			<SearchContainer>
				<SysTextField
					name="search"
					placeholder="Pesquisar por nome"
					onChange={controller.onChangeTextField}
					startAdornment={<SysIcon name={'search'} />}
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
											<AssignmentIcon />
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography sx={{ textDecoration: tarefa.statusTask ? 'line-through' : 'none' }}>
													{tarefa.description}
												</Typography>
											} secondary={usuario? usuario.username: ""} />
										<IconButton onClick={() => navigate(`/todo/edit/${tarefa._id}`)}>
											<EditNoteIcon />
										</IconButton>
										<IconButton onClick={() => {
											const idTarefa = tarefa._id?.toString() ?? '';
											controller.onDeleteTask(idTarefa);
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
					{/* <ComplexTable
						data={controller.todoList}
						schema={controller.schema}
						onRowClick={(row) => navigate('/todo/view/' + row.id)}
						searchPlaceholder={'Pesquisar exemplo'}
						onEdit={(row) => navigate('/todo/edit/' + row._id)}
						onDelete={(row) => {
							DeleteDialog({
								showDialog: sysLayoutContext.showDialog,
								closeDialog: sysLayoutContext.closeDialog,
								title: `Excluir dado ${row.title}`,
								message: `Tem certeza que deseja excluir o arquivo ${row.title}?`,
								onDeleteConfirm: () => {
									controller.onDeleteButtonClick(row);
									sysLayoutContext.showNotification({
										message: 'Excluído com sucesso!'
									});
								}
							});
						}}
					/> */}
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
