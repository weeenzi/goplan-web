import React, { useEffect, useState } from "react";
import httpService from "lib/httpService";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import TimelineWeek from "components/TimelineWeek";
import TodoActionGroup from "components/TodoActionGroup";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { isInWeekRange } from "lib/rangeCheck";

export default function TimelineWeekContainer() {
  const params = useParams();
  const todosUrl = params.projectId !== undefined ? `/todos.json/?project_id=${params.projectId}` : '/todos.json';
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedWeek = searchParams.get("week") !== null ? moment(searchParams.get("week")) : moment().startOf("week");
  const [todos, setTodos] = useState([]);
  const todosInJSON = JSON.stringify(todos);

  const handleTodayClick = (event) => {
    setSearchParams({ week: moment().format("YYYY[W]WW") });
  }

  const handlePreviousWeekClick = (event) => {
    setSearchParams({ week: selectedWeek.clone().subtract(1, "weeks").format("YYYY[W]WW") });
  }

  const handleNextWeekClick = (event) => {
    setSearchParams({ week: selectedWeek.clone().add(1, "weeks").format("YYYY[W]WW") });
  }

  const handleDayChange = (todo, days) => {
    const startDate = (todo.startDate !== null) ? moment(todo.startDate) : moment();
    const endDate = (todo.endDate !== null) ? moment(todo.endDate) : moment();

    const todoData = {
      project_id: todo.projectId,
      name: todo.name,
      description: todo.description,
      repeat: todo.repeat,
      repeat_period: todo.repeatPeriod,
      repeat_times: todo.repeatTimes,
      instance_time_span: todo.instanceTimeSpan
    };

    if (isInWeekRange(startDate, selectedWeek)) {
      todoData.start_date = startDate.day(days[0]).toISOString();
    }

    if (isInWeekRange(endDate, selectedWeek)) {
      todoData.end_date = endDate.day(days[1]).toISOString();
    }

    httpService.put(`/todos/${todo.id}.json`, todoData)
      .then((response) => {
        const updatedTodo = response.data;
        setTodos((todos) => {
          return todos.map((todo) => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }
            else {
              return todo;
            }
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleTodoChange = (event, todo) => {
    const todoData = {
      status: event.target.checked,
    };

    httpService.put(`/todos/${todo.id}.json`, todoData)
      .then((response) => {
        const updatedTodo = response.data;
        setTodos((todos) => {
          return todos.map((todo) => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }
            else {
              return todo;
            }
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    httpService.get(todosUrl)
      .then((response) => {
        setTodos(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, [todosUrl, todosInJSON]);

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h3" component="div">
                {selectedWeek.format("MMMM, YYYY")}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Button variant="outlined" onClick={handleTodayClick} sx={{ maxWidth: 160 }}>
                  Today
                </Button>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <IconButton onClick={handlePreviousWeekClick} sx={{ maxWidth: 160 }}>
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton onClick={handleNextWeekClick} sx={{ maxWidth: 160 }}>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Stack>
                <TodoActionGroup activeViewTitle="Week" />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TimelineWeek todos={todos} selectedWeek={selectedWeek} handleTodoChange={handleTodoChange} handleDayChange={handleDayChange}/>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
