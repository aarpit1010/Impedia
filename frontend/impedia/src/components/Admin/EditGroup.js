import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    TextField,
    CircularProgress,
    Button,
    Typography,
    Collapse,
    IconButton
} from '@material-ui/core';
import {
    Autocomplete,
    Alert,
    AlertTitle
} from '@material-ui/lab';
import {
    Close as CloseIcon
 } from '@material-ui/icons';
import axios from 'axios';
import DomainPic from '../../assets/Admin/addAuthoritiesPage.svg';
import TopBar from '../TopBar/TopBar';


const useStyles = makeStyles(theme => ({
    Alert:{
        width:"80vw",
        position:"fixed",
        top:"5%",
        margin:"auto",
        left:"10vw",
        zIndex:"100"
    },
    appealToText:{
        fontWeight:"600",
        fontSize:"20px"
    },
    setDomainPage: {
        margin: "2% 0"
    },
    Domainbody: {
        display: "flex",
        width: "90%",
        margin: "5% auto",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            margin: "15% auto",
        }
    },
    group: {
        background: "red"
    },
    domainArea: {
        flex: "50%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center"
    },
    domainTextArea: {
        flex: "100%",
        display: "flex",
        alignItems: "center",
    },
    textField: {
        width: "90%",
        margin: "auto 5%",
    },
    domainIcon: {
        width: "100px",
        backgroundColor: "#FFAC41",
        padding: "20px",
        borderRadius: "25px",
        [theme.breakpoints.down("md")]: {
            width: "50px"
        }
    },
    authIds:{
        margin:"20px 0"
    },
    button: {
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            margin: "2% auto"
        }
    },
    submitButton: {
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        width: "200px",
        fontWeight: "800",
        padding: "5%",
        fontSize: "16px"
    },
    sidePic: {
        flex: "50%",
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            margin: "5% auto"
        }
    },
    domainPic: {
        maxWidth: "100%"
    },
    labelColor: {
        color: "rgb(244, 67, 54)"
    },
    formWrapper: {
        width: "100%",
    },
    fieldWrapper:{
        marginBottom: "20px",
    },
    disableName:{
        opacity:"0.4"
    }
}));

const EditGroup = () => {
    const classes = useStyles();
    const [optionsAuth, setOptionsAuth] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);
    const loadingAuth = openAuth && optionsAuth.length === 0;
    const [openGroup, setOpenGroup] = useState(false);
    const [optionsGroup, setOptionsGroup] = useState([]);
    const [allGroupsData, setAllGroupsData] = useState([]);
    const [initVals,setInitVals] = useState([]);
    const loadingGroup = openGroup && optionsGroup.length === 0;
    const [authorityIds, setAuthorityIds] = useState([]);
    const [groupSelected, setGroupSelected] = useState();
    const [reload,setReload] = useState(false);
    const [sucessAlert,setSuccessAlert] = useState(false);
    const [failureAlert,setFailureAlert] = useState(false);

    useEffect(() => {
        let active = true;

        if (loadingGroup === true) {
            return undefined;
        }

        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                    authorization: AdminToken,
                }
            }
            const res = await axios.get("/group", config)
            const dataGroups = res.data;

            if (active) {
                setAllGroupsData(dataGroups);
                setOptionsGroup(() => {
                    return dataGroups.map((option) => {
                        let firstLetter = option.name[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            ...option,
                        }
                    })
                });
            }
        })();

        setReload(false);

        return () => {
            active = false;
        };
    }, [loadingGroup, reload]);

    useEffect(() => {
        let active = true;

        if (loadingAuth === true) {
            return undefined;
        }

        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                    authorization: AdminToken,
                }
            }
            const res = await axios.get("/authority", config)
            const dataAuth = res.data;
            if (active) {
                setOptionsAuth(() => {
                    return dataAuth.map((option) => {
                        let firstLetter = option.email[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            optionName: typeof option.name !== "undefined" ? (option.name + " | " + option.email) : (option.email),
                            ...option,
                        }
                    })
                });
            }
        })();

        setReload(false);

        return () => {
            active = false;
        };
    }, [loadingAuth, reload])

    useEffect(()=>{
        setInitVals(()=>{
            if(allGroupsData === [])
                return []

            if(!groupSelected || typeof groupSelected === "undefined"){
                return []
            }
            const ag = allGroupsData.find((obj)=> obj.id===groupSelected.id);
            if(!ag)
                return []
            
            return ag.members.map((option) => {
                let firstLetter = option.email[0].toUpperCase();
                return {
                    firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                    optionName: typeof option.name !== "undefined" ? (option.name + " | " + option.email) : (option.email),
                    ...option,
                }
            })
        })
    },[groupSelected, allGroupsData])

    useEffect(()=>{
        setAuthorityIds(initVals)
    },[initVals])

    const submitFunction = async (e) => {
        e.preventDefault();
        console.log(authorityIds);

        const body = {
            memberUpdate: authorityIds.map((authority) => {
                return authority.id
            }),
            nameUpdate: groupSelected.name
        }
        const AdminToken = localStorage.getItem("key");
        const config = {
            headers: {
                authorization: AdminToken,
            }
        }

        axios.put(`/admin/authoritygroup/${groupSelected.id}`, body, config)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setSuccessAlert(true);
                } else {
                    setFailureAlert(true);
                }
            })
            .catch((err) => {
                console.log(err);
        });
        setReload(true);
        setGroupSelected("");
    }


    return (
        <>
            <div className={classes.setDomainPage}>

                {/* Alerts */}
                <div className={classes.Alert}>
                    <Collapse in={sucessAlert}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setSuccessAlert(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity="success"
                        variant="filled"
                        >
                        <AlertTitle><strong>Successful !</strong></AlertTitle>
                            The Authority Group was successfully updated.
                        </Alert>
                    </Collapse>
                </div>   

                <div className={classes.Alert}>
                        <Collapse in={failureAlert}>
                            <Alert
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setFailureAlert(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            severity="error"
                            >
                            <AlertTitle><strong>Error !</strong></AlertTitle>
                                Some Error occurred. Please try again.
                            </Alert>
                        </Collapse>
                    </div>       
                {/* Alerts End */}
                <TopBar useCase="Edit Group" actor="ADMIN" />

                <div className={classes.Domainbody}>

                    <div className={classes.domainArea}>
                        <div className={classes.formWrapper}>
                            <div className={classes.domainTextArea}>
                                <div className={classes.textField}>
                                    <div className={classes.fieldWrapper}>
                                    <Typography className={classes.appealToText}>
                                        Select Authority Group:
                                    </Typography>
                                        <Autocomplete
                                            id="group"
                                            disableClearable
                                            key={reload}
                                            getOptionSelected={(option, value) => option.name === value.name}
                                            getOptionLabel={(option) => option.name}
                                            loading={loadingGroup}
                                            options={optionsGroup.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            groupBy={(option) => option.firstLetter}
                                            onChange={(e, v) => { setGroupSelected(v) }}
                                            onOpen={() => {
                                                setOpenGroup(true);
                                            }}
                                            onClose={() => {
                                                setOpenGroup(false);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Search Group"
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputProps={{
                                                        ...params.InputProps, 
                                                        type: 'search', 
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingGroup ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className={classes.fieldWrapper}>
                                        <TextField 
                                            fullWidth
                                            variant="filled"
                                            key={reload}
                                            error
                                            label="Group Name"
                                            helperText="Edit the Group Name here"
                                            className={typeof groupSelected ==="undefined" ? classes.disableName : ""}
                                            value={typeof groupSelected !=="undefined" ? groupSelected.name : " "}
                                            onChange={(e)=>{
                                                setGroupSelected((prev)=>({
                                                    ...prev,
                                                    name:e.target.value
                                                }))
                                            }}
                                        />

                                        <Autocomplete
                                            className={classes.authIds}
                                            multiple
                                            id="authority"
                                            value={authorityIds}
                                            open={openAuth}
                                            onOpen={() => {
                                                setOpenAuth(true);
                                            }}
                                            onClose={() => {
                                                setOpenAuth(false);
                                            }}
                                            getOptionSelected={(option, value) => option.optionName === value.optionName}
                                            getOptionLabel={(option) => option.optionName}
                                            loading={loadingAuth}
                                            options={optionsAuth.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            groupBy={(option) => option.firstLetter}
                                            onChange={(e, v) => { setAuthorityIds(v) }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error
                                                    multiline
                                                    rowsMax={10}
                                                    label="Authorities"
                                                    variant="filled"
                                                    helperText="Add / Delete Authorities from the Group"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingAuth ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className={classes.button}>
                            <Button variant="contained" className={classes.submitButton} onClick={submitFunction}>
                                UPDATE
                            </Button>
                        </div>
                    </div>


                    <div className={classes.sidePic}>
                        <img src={DomainPic} className={classes.domainPic} alt="Set/Update Domain" />
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditGroup;