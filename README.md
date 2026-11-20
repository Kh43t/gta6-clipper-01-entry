# GTA 6 — Lucia Goes Full Chaos (gta6-clipper-01)

An AI-agent-made vertical clip for make.fun's **gta6-clipper-01** bounty
("Clip GTA 6 for the most YouTube views", $500, top 20 share the prize).
Places go by the video's YouTube views at the deadline, most first.

## The clip

- **Hook (12 s):** the densest action run of Rockstar's GTA VI Launch
  Trailer — masked crew with rifles, a street explosion, a rooftop crew,
  a night pursuit, a sniper scope, ending on Lucia firing her rifle as an
  explosion erupts behind her. It opens mid-action with zero setup and
  ends on the trailer's single biggest action frame, so the viewer is
  still watching when the pitch starts.
- **Pitch end-card (6 s):** the Lucia/explosion frame, frozen and
  darkened, with the make.fun pitch on screen:

  > Make clips like this with AI and earn money on make.fun
  > make.fun/bounty/gta6-clipper-01

- **Format:** vertical 1080×1920, 30 fps, 18 seconds total — a YouTube
  Short. Source footage: Rockstar Games GTA VI Launch Trailer
  (`GTAVI_Launch_Trailer.mp4`, 3840×2160, 89.17 s), letterbox removed,
  center-cropped to vertical, original audio fading out at the end of
  the hook.
- **Rendered file:** `clip.mp4` in the work directory
  (`gta6-clipper-01-work/`), rendered in-session with ffmpeg.

## Upload (for maK — from your phone to the Serdadu channel)

- **Title:** GTA 6's CRAZIEST 12 Seconds 🔥 Lucia Goes Full Chaos #Shorts
- **Visibility:** Public (not unlisted, not private), before the
  23 Nov 2026 08:00 WIB deadline.
- **Description** — paste exactly, first two lines word for word:

  ```
  Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01

  Play code: makefun-macaroni-cake-orchid

  The craziest 12 seconds of Rockstar's GTA VI Launch Trailer — Lucia goes full chaos in Vice City. Cut by my AI agent as a vertical Short.
  #GTA6 #GTAVI #Shorts #ViceCity
  ```

- After upload, send the video's Share link back: `VIDEO.json` in this
  repository gets the real address
  (`{"url": "https://www.youtube.com/shorts/<id>"}`), then the entry is
  bundled, checked and submitted. Keep the video public until the
  results are out.

## The entry program

`main.ts` (Node 22, standard library only) reads `VIDEO.json`, validates
that it names a real YouTube video address, and writes the same bytes to
the output directory. Run it the way the grader does:

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How the clip was made (for the transcript record)

The whole loop happened inside the agent's recorded session: the trailer
was inspected frame by frame, the moment (t=61–73 s) was chosen and the
creative decided there, and the clip was cut and rendered with ffmpeg
commands run in that session. Render command (from the work directory):

```
ffmpeg -i src/GTAVI_Launch_Trailer.mp4 -loop 1 -t 6 -i frames/endcard_bg.png \
  -filter_complex "[0:v]trim=start=61:end=73,setpts=PTS-STARTPTS,crop=3840:1920:0:120,crop=1080:1920:1380:0,setsar=1,fps=30[hookv];[0:a]atrim=start=61:end=73,asetpts=PTS-STARTPTS,afade=t=out:st=11:d=1[hooka];[1:v]crop=3840:1920:0:120,crop=1080:1920:1380:0,setsar=1,fps=30,eq=brightness=-0.35:saturation=0.9,drawbox=x=60:y=700:w=960:h=460:color=black@0.55:t=fill,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='Make clips like this with AI':fontcolor=white:fontsize=62:borderw=2:bordercolor=black:x=(w-text_w)/2:y=760,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='and earn money on make.fun':fontcolor=white:fontsize=62:borderw=2:bordercolor=black:x=(w-text_w)/2:y=860,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='make.fun/bounty/gta6-clipper-01':fontcolor=#ffd94d:fontsize=40:borderw=2:bordercolor=black:x=(w-text_w)/2:y=1000,setpts=PTS-STARTPTS[cardv];anullsrc=r=48000:cl=stereo,atrim=0:6,asetpts=PTS-STARTPTS[carda];[hookv][hooka][cardv][carda]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 128k -movflags +faststart clip.mp4 -y
```

No views were bought or botted; the video's views are whatever YouTube
counts organically.
