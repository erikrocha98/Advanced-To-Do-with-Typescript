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
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox,
} from '@mui/material';
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
	useEffect(() => {
		todoApi.showAllTasks((error, result) => {
			if (error) {
				return sysLayoutContext.showNotification({
					type: "error",
					title: "Erro ao carregar tarefas",
					message: `${error}`,
				});
			} else {
				setTarefas(result);
			}
		});
	}, []);

	const {
		Container,
		LoadingContainer,
		SearchContainer
	} = TodoListStyles;

	const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];
	const handleClick = () => {
		setOpen(!open);
	}
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
									<Typography variant="h6">Não Concluídas ({tarefas.length})</Typography>
								}
							/>
						</ListItem>

						<Collapse in={open} timeout="auto" unmountOnExit>
							{tarefas.map((tarefa: ITodo) => (
								<Box>
									<Divider/>
									<ListItem key={tarefa._id}>
										<ListItemIcon>
											<Checkbox
												edge="start"
												tabIndex={-1}
												disableRipple
												icon={<RadioButtonUncheckedIcon />}
												checkedIcon={<CheckCircleIcon />}
											/>
											
										</ListItemIcon>
										<ListItemIcon>
											<AssignmentIcon/>
										</ListItemIcon>
										<ListItemText primary={tarefa.description} secondary="Criada por: Você" />
										<IconButton onClick={()=>{navigate('/todo/edit/:_id')}}>
											<EditNoteIcon/>
										</IconButton>
										<IconButton sx={{color: "#f44336"}}>
											<DeleteIcon/>
										</IconButton>
									
	
									</ListItem>
									<Divider/>
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
