import styles from './CreatePost.module.css';
import InputField from '../InputField/InputField.jsx';
import SubmitBtn from '../SubmitBtn/SubmitBtn.jsx';
import ErrorParagraph from '../ErrorParagraph/ErrorParagraph.jsx'; 
import * as postService from '../../service/postService.js';
import { handleResponse } from '../../utils/handleResponse.js';
import useForm from '../../hooks/useForm.jsx';
import { validateValues } from '../../utils/validatePostForm.js';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

export default function CreatePost() {
 const {formValues, onChangeHandler} = useForm({
    country: '',
    city: '',
    imageUrl: '',
    cost: 0,
    description: '',
  });

  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validateValues(formValues));
    setSubmitting(true);
  };

  async function finnishSubmit() {
    try {
      const response = await postService.createPost(formValues);
      await handleResponse(response);
    } catch (error) {
      setApiError(error.message);
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finnishSubmit();
      navigate('/')
    }
  }, [errors]);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.login}>
        <h2>Create Post</h2>
        {apiError ? <ErrorParagraph message={apiError} /> : null}
        <InputField
          label="country"
          title="Country"
          type="text"
          name="country"
          placeholder="Country"
          id="country"
          value={formValues.country}
          onChange={onChangeHandler}
          error = {errors.country}
        />
        {errors.country ? <ErrorParagraph message={errors.country} /> : null}
        <InputField
          label="city"
          title="city"
          type="text"
          name="city"
          placeholder="City"
          id="city"
          value={formValues.city}
          onChange={onChangeHandler}
          error = {errors.city}
        />
        {errors.city ? <ErrorParagraph message={errors.city} /> : null}
        <InputField
          label="imageUrl"
          title="Image"
          type="text"
          name="imageUrl"
          placeholder="Image"
          id="imageUrl"
          value={formValues.imageUrl}
          onChange={onChangeHandler}
          error = {errors.imageUrl}
        />
        {errors.imageUrl ? <ErrorParagraph message={errors.imageUrl} /> : null}
        <InputField
          label="cost"
          title="Cost"
          type="number"
          name="cost"
          placeholder="0"
          id="cost"
          value={formValues.cost}
          onChange={onChangeHandler}
          error = {errors.cost}
        />
        {errors.cost ? <ErrorParagraph message={errors.cost} /> : null}
        <label htmlFor="description">Description</label>
        <textarea
        className={errors.description ? styles.errorTextarea : styles.textarea}
          name="description"
          id="description"
          cols="30"
          rows="10"
          value={formValues.description}
          onChange={onChangeHandler}
        ></textarea>
        {errors.description ? <ErrorParagraph message={errors.description} /> : null}
        <SubmitBtn name="Create" />
      </form>
    </>
  );
}
