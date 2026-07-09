import { Switch, Route } from 'wouter';
import LithosHero from '@/components/LithosHero';
import HomgridPage from '@/components/HomgridPage';
import AIFloorPlanner from '@/pages/AIFloorPlanner';

export default function App() {
  return (
    <Switch>
      <Route path="/ai-floor-planner" component={AIFloorPlanner} />
      <Route>
        <LithosHero />
        <HomgridPage />
      </Route>
    </Switch>
  );
}
