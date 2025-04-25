import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { List, ListItemButton, ListItemIcon } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { useContext } from 'react';

const todoListView = () => {
    const controller = React.useContext(contexto do todoList);

    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    }
    return (
        <Container>
            <Typography variant="h5">Lista de Itens</Typography>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tarefa 1" secondary="Criado por: Usuário X" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </List>
            </Collapse>
        </Container>
    )
}

export default todoListView;