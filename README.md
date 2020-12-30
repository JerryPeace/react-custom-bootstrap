<a href='https://10.1.116.103:8443/job/React%20Commercial%20Bootstrap/'><img src='https://10.1.116.103:8443/buildStatus/icon?job=React Commercial Bootstrap'></a>

[Lastest Build Result](https://10.1.116.103:8443/job/React%20Commercial%20Bootstrap/ws/)

# Will not publish package in this branch
Currently we don't publish package in this branch. Please merge this codeline to your product RCB branch.
Plan to support react 16

UI Spec
------------
* [visual spec](http://tw-hiesrv/www_server/uiwww/segment/01_enterprise/ENT_UX_Go/Style%20Refreshment/VisualSpec/)
* [stylel portal](http://style-portal.tw.trendnet.org/#/styles/minimalism/1.1.0/cc15a791-8a8e-4d02-b35a-a415a7da7ea5)

Environment
------------


- You should install **babel-cli** and **webpack** to global


Install Steps
------------

1. Install node modules
```sh
$ npm install
```

2. Run development bundle server which automatically updates bundles on the fly on a dev-server
```sh
$ npm run dev-server
```

3. Run demo server
```sh
$ npm run start-dev
```

4. Open [http://localhost:8080/] or [http://localhost:2993/app/]

[http://localhost:2993/app/]: http://localhost:2993/app/
[http://localhost:8080/]: http://localhost:8080/

Dependency
-------------
react: 0.14.2

react-dom: 0.14.2

react-datagrid: 2.0.1
<https://adc.github.trendmicro.com/Core-DeepDiscovery/react-datagrid>

commercial-bootstrap
(※ Please import this css in your project, we follow bootstrap 3.0 dom structure, it's no problem if you have a custom bootstrap)

<https://adc.github.trendmicro.com/Core-DeepDiscovery/commercial-bootstrap>


How to install in your project by package.json
-------
```sh
"react-commercial-bootstrap": "git+ssh://git@adc.github.trendmicro.com:Core-DeepDiscovery/commercial-bootstrap.git"
```
Then npm install .

Or via private npm server <http://npm.tw.trendnet.org:8000/>
```sh
"react-commercial-bootstrap": "v0.3.8"
```

Example: How to use
-------
```
import {TextField, Button} from 'react-commercial-bootstrap';
```
