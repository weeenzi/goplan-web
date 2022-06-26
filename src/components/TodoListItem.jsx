import { Collapse, Grid } from "@mui/material";
import React from "react";
import PropTypes from 'prop-types';
import SHARED_PROP_TYPES from 'utils/sharedPropTypes';
import TodoItem from "./TodoItem/TodoItem";

export default function TodoListItem(props) {
  const [open, setOpen] = React.useState(false);

  const handleTodoExpand = () => {
    setOpen(!open);
  };
  return (
    <>
      <Grid item xs={12}>
        <TodoItem todo={props.todo} expandable={props.expandable} handleTodoChange={props.handleTodoChange} handleTodoExpand={handleTodoExpand} />
        <Grid item xs={12} md={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {props.todo.dependents.map((dependent, index) => (
              <Grid key={index} container item xs={12} md={12}>
                <TodoListItem key={index} todo={dependent} expandable={props.expandable} handleTodoChange={props.handleTodoChange} />
              </Grid>
            ))}
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
}

TodoListItem.propTypes = {
  todo: SHARED_PROP_TYPES.todo,
  expandable: PropTypes.bool.isRequired,
  handleTodoChange: PropTypes.func.isRequired,
};