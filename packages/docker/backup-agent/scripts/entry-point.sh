#!/usr/bin/env sh

backup_folder_to_bucket () {
  rclone copy \
    "source:$1" \
    "pegasus-backups:$2" \
    --verbose \
    --bwlimit "08:00,125 12:00,off 13:00,125 18:00,315 23:59,off" \
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
    /data/archon/*)
      FOLDER_NAME=/data/archon
      BUCKET_NAME=pegasus-backup-test
      ;;
    *)
      ;;
  esac

  CURRENT_TIME=`date -u "+%Y-%m-%d %H:%M:%S"`

  if [ -z "$BUCKET_NAME" ]
  then
    >&2 echo "$CURRENT_TIME $1: Changes detected, but no backup bucket configured for directory"
  else
    echo "$CURRENT_TIME $1: Changes detected; backing '${FOLDER_NAME}' up to bucket '${BUCKET_NAME}'"
    backup_folder_to_bucket "${FOLDER_NAME}" "${BUCKET_NAME}"
  fi
}

# paths with @ are _excluded_
inotifywait "@/data/archon/Sandbox Sync" --monitor --recursive /data -e close_write -e moved_to |
  while read dir action file; do
    backup_folder "$dir"
  done
