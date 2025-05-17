import React from "react";
import { Meteor } from "meteor/meteor";
import { Typography } from "@mui/material";
import AppLayoutContext, { IAppLayoutContext } from "/imports/app/appLayoutProvider/appLayoutContext";
import { ITodo } from "../../../modules/todo/api/todoSch";
import { todoApi } from "/imports/modules/todo/api/todoApi";
import { useContext } from "react";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";



export const WelcomePage: React.FC = () => {

    const [tasks, setTasks] = useState<ITodo[]>([]);
    const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
    const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
    const navigate = useNavigate();

    useEffect(() => {
        todoApi.showRecentTasks((error, result) => {
            if (error) {
                return sysLayoutContext.showNotification({
                    type: "error",
                    title: "Erro ao carregar tarefas",
                    message: `${error}`,
                });
            } else {
                console.log("Tarefas recebidas:", result); // <-- Verifique se nomeUsuario aparece aqui
                setTasks(result);
            }
        });
    }, []);

    /* const TaskItem: React.FC<{ task: ITodo }> = ({ task }) => {
        const [username, setUsername] = useState<string>("");

        useEffect(() => {
            todoApi.getUsernameById(task.createdby?.toString() ?? '', (error: any, result: string) => {
                if (error) {
                    console.error("Erro ao buscar nome do usuário:", error);
                    setUsername("");
                } else {
                    setUsername(result);
                }
            });
        }, [task.createdby]); */


        return (
            <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <header>
                    <Typography variant="h2">Olá, caro usuário</Typography>
                    <Typography variant="body2">Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você</Typography>
                </header>
                <Box sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper", mt: "24px" }}>
                    <Typography variant="h3">Atividades Recentes: </Typography>
                    {tasks.map((task: ITodo & { nomeUsuario?: string }) => (
                        <List sx={{ width: "100%" }}>
                            <ListItem key={task._id}>
                                <ListItemButton>
                                    <ListItemText primary={task.description} secondary={task.createdby}
                                    />
                                </ListItemButton>

                            </ListItem>
                            <Divider />
                        </List>
                    ))}
                    <Button onClick={() => {
                        navigate("/todo");
                    }}>
                        <Typography variant="h3">Minhas Tarefas</Typography>
                    </Button>
                </Box>
            </Container>
        )
    }
