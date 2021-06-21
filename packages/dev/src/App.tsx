import React from "react";
import {
  Avatar,
  Brand,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar,
} from "@patternfly/react-core";
import imgBrand from "./assets/images/imgBrand.svg";
import imgAvatar from "./assets/images/imgAvatar.svg";
import { Link, useHistory } from "react-router-dom";
import Demos from "./Demos";
import "./App.css";
import {
  LoadingBox,
  QuickStartContextProvider,
  QuickStartContextValues,
  QuickStartDrawer,
  useLocalStorage,
  QuickStart
} from "@patternfly/quickstarts";
import { allQuickStarts as yamlQuickStarts } from "./quickstarts-data/quick-start-test-data";
import { loadJSONQuickStarts } from "./quickstarts-data/mas-guides/quickstartLoader";
import i18n from './i18n/i18n';

type AppProps = {
  children?: React.ReactNode;
  showCardFooters?: boolean;
};

const App: React.FC<AppProps> = ({ children, showCardFooters }) => {
  const history = useHistory();

  const [initialized, setInitialized] = React.useState(true);

  const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
    "quickstartId",
    ""
  );

  const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
    "quickstarts",
    {}
  );

  React.useEffect(() => console.log(activeQuickStartID), [activeQuickStartID]);
  React.useEffect(() => {
    // callback on state change
    console.log(allQuickStartStates);
  }, [allQuickStartStates]);

  const [
    allQuickStartsLoaded,
    setAllQuickStartsLoaded,
  ] = React.useState<boolean>(false);
  const [allQuickStarts, setAllQuickStarts] = React.useState<QuickStart[]>([]);
  React.useEffect(() => {
    const load = async () => {
      const masGuidesQuickstarts = await loadJSONQuickStarts("");
      setAllQuickStarts(yamlQuickStarts.concat(masGuidesQuickstarts));
      setAllQuickStartsLoaded(true);
    };
    load();
  }, []);

  if (!initialized) return <div>Loading</div>;

  const AppToolbar = (
    <PageHeaderTools>
      <Avatar src={imgAvatar} alt="Avatar image" />
    </PageHeaderTools>
  );

  const AppHeader = (
    <PageHeader
      logo={<Brand src={imgBrand} alt="Patternfly Logo" data-quickstart-id="logo" />}
      headerTools={AppToolbar}
      showNavToggle
      isNavOpen
    />
  );

  const AppNav = (
    <Nav aria-label="Nav">
      <NavList>
        {Demos.map((demo, index) => (
          <NavItem itemId={index} key={demo.id}>
            <Link
              id={`${demo.id}-nav-item-link`}
              to={demo.to}
              data-quickstart-id={demo.id}
            >
              {demo.name}
            </Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );

  const AppSidebar = <PageSidebar isNavOpen nav={AppNav} />;

  const { pathname: currentPath } = window.location;
  const quickStartPath = "/quickstarts";

  const resourceBundle = i18n.getResourceBundle(localStorage.getItem('bridge/language'), 'quickstart');

  const valuesForQuickstartContext: QuickStartContextValues = {
    allQuickStarts,
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
    footer: {
      show: showCardFooters,
      showAllLink: currentPath !== quickStartPath,
      onShowAllLinkClick: () => history.push(quickStartPath),
    },
    lng: localStorage.getItem('bridge/language'),
    resourceBundle: {
      ...resourceBundle,
      "Start": "Let's go!",
      "Continue": "Resume",
      "Restart": "Start over"
    },
  };

  return (
    <React.Suspense fallback={<LoadingBox />}>
      {allQuickStartsLoaded && (
        <QuickStartContextProvider value={valuesForQuickstartContext}>
          <QuickStartDrawer>
             <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
              {children}
             </Page>
           </QuickStartDrawer>
        </QuickStartContextProvider>
      )}
    </React.Suspense>
  );
};
export default App;
