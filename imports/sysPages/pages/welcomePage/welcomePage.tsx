import React from "react";
import { Meteor } from "meteor/meteor";
import { Typography } from "@mui/material";
import { exampleApi } from "/imports/modules/example/api/exampleApi";
import { IExample } from "/imports/modules/example/api/exampleSch";
import AppLayoutContext, { IAppLayoutContext } from "/imports/app/appLayoutProvider/appLayoutContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export const WelcomePage: React.FC = () => {

    const [tasks, setTasks] = useState<IExample[]>([]);
    const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
    const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
    useEffect(() => {
        exampleApi.showRecentTasks((error, result) => {
            if (error) {
                return sysLayoutContext.showNotification({
                    type: "error",
                    title: "Erro ao carregar tarefas",
                    message: `${error}`,
                });
            } else {
                setTasks(result);
            }
        });
    }, []);
    return (
        <>
            <header>
                <Typography variant="h2">Olá, caro usuário</Typography>
                <Typography variant="body1">Seus projetos muito mair organizados. Veja as tarefas adicionadas por seu time, por você e para você</Typography>
            </header>
            <Typography variant="h3">Atividades Recentes: </Typography>
            <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                {tasks.map((task: IExample) => (
                    <List sx={{ width: "100%" }}>
                        <ListItem key={task._id}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Checkbox
                                        icon={<RadioButtonUncheckedIcon />}
                                        checkedIcon={<CheckCircleIcon />}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={task.title} secondary="usuário X" />
                            </ListItemButton>

                        </ListItem>
                        <Divider />
                    </List>
                ))}
            </Box>
        </>
    )
}