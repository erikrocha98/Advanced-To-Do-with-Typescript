import React from "react";
import { Typography } from "@mui/material";
import HomeStyles from "../home/homeStyle";


export const WelcomePage: React.FC = () =>{
    const { Header, } = HomeStyles;
    return (
        <Header>
            <Typography variant="h3">Olá, caro usuário</Typography>
            <Typography variant="body1">Seus projetos muito mair organizados. Veja as tarefas adicionadas por seu time, por você e para você</Typography>
        </Header>
    )
}