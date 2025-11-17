"use client";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "./axiosServices";

function AxiosInterceptorSetup() {
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        setupAxiosInterceptors(enqueueSnackbar);
    }, [enqueueSnackbar]);

    return null;
}
export default AxiosInterceptorSetup;