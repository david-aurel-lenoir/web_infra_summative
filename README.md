# NoticeNudge

NoticeNudge helps people understand long everyday notices. Paste a notice to create a simpler draft, highlight likely action sentences, find dates written in the notice, and add or check tasks. The word helper can look up one English word at a time.

## Demo Video 
[https://youtu.be/3Rb5XowlvUE]


## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Page content and forms |
| `styles.css` | Page layout and mobile styling |
| `app.js` | Draft simplification, task and date extraction, and dictionary lookup |
| `config.json` | Dictionary API endpoint |
| `nginx-web.conf` | Nginx configuration for each web server (serves the app and `/server-info`) |
| `nginx-lb.conf` | Nginx load balancer configuration |
| `.gitignore` | Files to leave out of Git |


## Features

- Rewrites a selection of common formal phrases in simpler English.
- Shows key sentences that may contain actions or dates.
- Finds possible action sentences and creates a checklist.
- Lets a user add tasks and mark them complete.
- Finds dates written in common formats and shows their surrounding sentence.
- Looks up one English word using the Free Dictionary API.
- Copies the draft, checklist, and recognized dates.
- Shows clear messages when input is empty or the dictionary is unavailable.
- Displays which web server handled the request behind the load balancer.

## API and attribution

The word helper uses the **Free Dictionary API**: https://dictionaryapi.dev/

The browser sends only the single word entered into the word helper. The notice text is processed by JavaScript in the browser tab. It is not sent to the dictionary API or stored after the page is closed. Users should remove private information from a notice before pasting it.

NoticeNudge uses phrase substitutions and simple matching rules. It is not an AI service and cannot confirm the legal, medical, financial, or other meaning of a notice. It can miss actions or dates, so compare the draft and checklist with the original before acting.

## Run locally

Open a terminal in the project folder and run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Internet access is needed for word definitions. The "Served by ..." footer is shown only when `/server-info` is available (for example, when running behind the Nginx web server configuration in this repository).


## Server details

| Role | Address |
| --- | --- |
| Web 01 | `3.10.169.232` |
| Web 02 | `3.8.49.140` |
| Load balancer | `35.178.51.72` |

## Live application

- **Load balancer:** [http://35.178.51.72](http://35.178.51.72)
- **Web 01:** [http://3.10.169.232](http://3.10.169.232)
- **Web 02:** [http://3.8.49.140](http://3.8.49.140)

### 1. Install the app on both web servers

Connect to Web 01 and Web 02. On each server, run:

```bash
sudo apt update
sudo apt install nginx -y
sudo mkdir -p /var/www/noticenudge
```

From your computer, open a terminal in the project folder. Replace `WEB_IP` with the address of the server:

```bash
scp index.html styles.css app.js config.json nginx-web.conf ubuntu@WEB_IP:/tmp/
```

Connect to the server and install the files and configuration:

```bash
sudo cp /tmp/index.html /tmp/styles.css /tmp/app.js /tmp/config.json /var/www/noticenudge/
sudo cp /tmp/nginx-web.conf /etc/nginx/sites-available/noticenudge
sudo ln -sf /etc/nginx/sites-available/noticenudge /etc/nginx/sites-enabled/noticenudge
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Repeat the same steps on Web 02 so both servers have identical files.

### 2. Configure the load balancer

Connect to the load balancer and install Nginx if needed:

```bash
sudo apt update
sudo apt install nginx -y
```

From your computer, copy the load balancer config. Replace `LB_IP` with the address of the load balancer:

```bash
scp nginx-lb.conf ubuntu@LB_IP:/tmp/
```

On the load balancer, confirm the backend IP addresses in `/tmp/nginx-lb.conf` match the current web server addresses, then run:

```bash
sudo cp /tmp/nginx-lb.conf /etc/nginx/sites-available/noticenudge-lb
sudo ln -sf /etc/nginx/sites-available/noticenudge-lb /etc/nginx/sites-enabled/noticenudge-lb
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

The upstream uses Nginx round robin (default). Firewall/security group rules must allow inbound HTTP on port 80 to the load balancer and HTTP traffic from the load balancer to both web servers.

### 3. Check the app and load balancing

Open `http://35.178.51.72`, replacing the address if it changed. The footer should show `Served by ...`.

To request the server information several times, run this on your computer:

```bash
for i in 1 2 3 4 5 6; do curl -s http://35.178.51.72/server-info; done
```

Replace the IP if needed. The output should include both web server hostnames across repeated requests. If it does not, check the addresses in `nginx-lb.conf`, Nginx status on both web servers, and port 80 access from the load balancer.

## Project credit

NoticeNudge is an original notice-reading helper built for this assignment. Word definitions are provided by the Free Dictionary API.