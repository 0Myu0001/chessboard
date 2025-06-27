#!/usr/bin/env bash
# 使い方: bash segment.sh input.m4a
set -euo pipefail
INFILE=$1
# 配列に開始秒 end 秒
SEGS=(
  "0 3"
  "3 7"
  "7 13"
  "13 39"
  "39 45"
  "45 47"
  "47 51"
  "51 54"
  "54 67"  # 1:07
  "67 75"  # 1:15
)
mkdir -p public/segments
idx=1
for pair in "${SEGS[@]}"; do
  read -r SS TO <<< "$pair"
  ffmpeg -loglevel error -i "$INFILE" -ss "$SS" -to "$TO" -c copy "public/segments/segment${idx}.m4a"
  echo "segment${idx}.m4a done ($SS-$TO)"
  ((idx++))
done

echo "All segments exported to public/segments/"