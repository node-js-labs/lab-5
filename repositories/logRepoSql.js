const { Log } = require('../models');

exports.create = (log, tx) => {
  return Log.create(
    {
      userId:     log.userId ?? log.user_id,
      bookId:     log.bookId ?? log.book_id ?? null,
      action:     log.action,
      bookTitle:  log.bookTitle ?? log.book_title
    },
    { transaction: tx }
  );
};
