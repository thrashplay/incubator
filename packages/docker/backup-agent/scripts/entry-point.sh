#!/usr/bin/env sh

backup_folder_to_bucket () {
  rclone copy \
    source:$1 \
    pegasus-backups:$2 \
    --auto-confirm \
    --ignore-existing \
    --immutable \
    --stats-one-line-date

  # List of exit codes
  # 0 - success
  # 1 - Syntax or usage error
  # 2 - Error not otherwise categorised
  # 3 - Directory not found
  # 4 - File not found
  # 5 - Temporary error (one that more retries might fix) (Retry errors)
  # 6 - Less serious errors (like 461 errors from dropbox) (NoRetry errors)
  # 7 - Fatal error (one that more retries won’t fix, like account suspended) (Fatal errors)
  # 8 - Transfer exceeded - limit set by --max-transfer reached
}

backup_folder () {
  case "$1" in
    /data/backup-test/)
      BUCKET_NAME=pegasus-backup-test
      ;;
    *)
      ;;
  esac

  if [ -z "$BUCKET_NAME" ]
  then
    >&2 echo "`date -u "+%Y-%m-%d %H:%M:%S"` $1: Changes detected, but no backup bucket configured for directory"
  else
    echo "`date -u "+%Y-%m-%d %H:%M:%S"` $1: Changes detected; backing up to bucket '${BUCKET_NAME}'"
    backup_folder_to_bucket $1 $BUCKET_NAME
  fi
}

inotifywait "@/data/archon/Sandbox Sync" --monitor --recursive /data -e close_write -e moved_to |
  while read dir action file; do
    backup_folder $dir
  done
