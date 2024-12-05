import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../styles/breadcrumbs.scss';

const BreadcrumbsComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const pathItems = location.pathname.split('/');

    const backInPath = () => {
        const n = pathItems.length - 2;
        if (n >= 1) {
            navigate(pathItems.slice(0, pathItems.length - 1).join('/'), {
                state: n <= 2 ? { id: location.state.id } : location.state,
            });
        }
    };

    const clicLast = (url, n) => {
        if (n <= 2) {
            navigate(url, { state: { id: location.state.id } });
        } else {
            navigate(url, { state: location.state });
        }
    };

    return (
        <div className='breadcrumbs'>
            <div className='crumb-icon'>
                <IconButton onClick={backInPath}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className='crumbs-container'>
                {pathItems.map((item, index) => {
                    const to = `${pathItems.slice(0, index + 1).join('/')}`;
                    return (
                        index >= 1 && (
                            <div className='item' key={index}>
                                <Typography
                                    className={`item ${index === pathItems.length - 1 ? 'activate' : 'deactivate'}`}
                                    onClick={() => clicLast(to, index)}
                                    noWrap
                                >
                                    {index > 1 && index <= pathItems.length - 1 && '/ '}
                                    {index === 1 ? 'Inicio' : decodeURIComponent(item)}
                                    
                                </Typography>
                                
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
};

export default BreadcrumbsComponent;


