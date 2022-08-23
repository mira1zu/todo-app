import React, { useEffect, useState } from 'react';

import './TodoPage.scss';

import TodoHeader from '../../components/TodoHeader';
import TodoMain from '../../components/TodoMain';
import TodoFooter from '../../components/TodoFooter';
import Loader from '../../components/Loader';
import Toast from '../Toast';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTodos } from './todoPageSlice';
import { selectToast, showToast } from '../Toast/toastSlice';

import LoadingStatus from '../../enums/LoadingStatus';

export const TodoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, status: todosStatus } = useAppSelector(selectTodos);
  const { visible: isToastVisible } = useAppSelector(selectToast);

  const loading = todosStatus === LoadingStatus.Loading;
  const isError = todosStatus === LoadingStatus.Failed;

  const [appliedLoading, setAppliedLoading] = useState(false);

  useEffect(() => {
    if (isError) {
      dispatch(showToast('An error occurred while loading todos'));
    }
  }, [isError]);

  useEffect(() => {
    const timer = setTimeout(() => setAppliedLoading(loading), 500);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="TodoPage">
      <Loader visible={appliedLoading} />

      {isToastVisible && (
        <Toast />
      )}

      <div className="TodoPage-Content">
        <TodoHeader />

        {todos?.length > 0 && (
          <>
            <TodoMain />

            <TodoFooter />
          </>
        )}
      </div>
    </div>
  );
};
