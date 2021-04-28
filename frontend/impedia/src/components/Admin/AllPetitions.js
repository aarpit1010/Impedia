import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    makeStyles
} from '@material-ui/core';
import Petitions from '../AppealsandPetitions/Petitions';
import TopBar from '../TopBar/TopBar';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: "2% 0"
    },
    appeals: {
        width: "95vw",
        // maxWidth:"1000px",
        margin: "auto"
    }
}))

const AllPetitions = () => {
    const classes = useStyles();
    const [cookies] = useCookies(['user']);
    const [data, setData] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!cookies.user || cookies.user["type"] !== "ADMIN") {
            return history.push("/login/admin");
        }
    }, []);

    useEffect(() => {
        if (cookies.user) {
            const Token = cookies.user['key'];
            const config = {
                headers: {
                    authorization: Token,
                }
            }

            axios.get("/admin/appealspetitions", config)
                .then(res => res.data)
                .then(data => {
                    console.log(data);
                    setData(data.petitions.sort((a, b) => (new Date(b.dateTime) - new Date(a.dateTime))));
                })
        }
    }, [])

    return (
        <>
            <div className={classes.container}>
                <TopBar actor="ADMIN" useCase="Petitions" />
                <div className={classes.appeals}>
                    <Petitions data={data} />
                </div>
            </div>
        </>
    )
}

export default AllPetitions;