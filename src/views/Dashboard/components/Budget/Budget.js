import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Grid
} from '@material-ui/core';
import { formatDistance } from 'date-fns';
import huLocale from 'date-fns/locale/hu';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  }
}));

const Budget = ({ notes, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      {notes.map(note => {
        const created = formatDistance(new Date(note.Date), new Date(), {
          locale: huLocale
        });
        return (
          <Grid key={note.NoteId} item xs={12} sm={6}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <CardHeader
                title={note.Title}
                subheader={note.Teacher}
                action={created}
              />
              <CardContent>
                <Typography
                  className={classes.differenceValue}
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: note.Content.replace(/\n/g, '<br />')
                  }}></Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
