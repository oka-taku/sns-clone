import React, { useState } from 'react'
import { AppDispatch } from '../../app/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Auth.module.css'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, CircularProgress } from '@mui/material'
import { fetchAsyncGetPosts, fetchAsyncGetComments } from '../post/postSlice'
import {
    selectIsLoadingAuth,
    setOpenSignIn,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
} from './authSlice'

const SignUp: React.FC = () => {
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const dispatch: AppDispatch = useDispatch();
    const [error, setError] = useState("");

    return (
        <>
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values) => {
                    await dispatch(fetchCredStart());
                    const resultReg = await dispatch(fetchAsyncRegister(values));

                    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                        await dispatch(fetchAsyncLogin(values));
                        await dispatch(fetchAsyncCreateProf({ nickName: "noname" }));

                        await dispatch(fetchAsyncGetProfs());
                        await dispatch(fetchAsyncGetPosts());
                        await dispatch(fetchAsyncGetComments());
                        await dispatch(fetchAsyncGetMyProf());
                        await dispatch(resetOpenSignUp());
                        setError("");
                    }
                    if (fetchAsyncRegister.rejected.match(resultReg)) {
                        setError("メールアドレスは既に登録されています。");
                    }
                    await dispatch(fetchCredEnd());
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email("メールアドレスの形式が間違っています。")
                        .required("メールアドレスは必須です。"),
                    password: Yup.string().required("パスワードは必須です。").min(4, "")
                })}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => <div className={styles.auth_container}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.auth_signUp}>
                                <h1 className={styles.auth_title}>SNS clone</h1>
                                <br />
                                <div className={styles.auth_progress}>
                                    {isLoadingAuth && <CircularProgress />}
                                </div>
                                <br />
                                <TextField
                                    variant="standard"
                                    placeholder="メールアドレス"
                                    type="input"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />

                                {touched.email && errors.email ? (
                                    <div className={styles.auth_error}>{errors.email}</div>
                                ) : null}
                                <br />

                                <TextField
                                    variant="standard"
                                    placeholder="パスワード"
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                {touched.password && errors.password ? (
                                    <div className={styles.auth_error}>{errors.password}</div>
                                ) : null}
                                <br />
                                <br />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!isValid}
                                    type="submit"
                                >登録</Button>
                                <br />
                                <br />
                                <p className={styles.auth_error}>{error}</p>
                                <span
                                    className={styles.auth_text}
                                    onClick={async () => {
                                        await dispatch(setOpenSignIn());
                                        await dispatch(resetOpenSignUp());
                                        setError("");
                                    }}>
                                    アカウントをお持ちですか？
                                </span>
                            </div>
                        </form>
                    </div>}
            </Formik>
        </>
    )
}

export default SignUp