import { useStore } from '@builder.io/mitosis';
import Card from '../components/Card.lite';
import CardHeader from '../components/CardHeader.lite';
import CardFooter from '../components/CardFooter.lite';
import Stat from '../components/Stat.lite';
import Divider from '../components/Divider.lite';
import ListItem from '../components/ListItem.lite';
import Badge from '../components/Badge.lite';
import Progressbar from '../components/Progressbar.lite';
import ChartLine from '../components/ChartLine.lite';
import ChartHorizontalBar from '../components/ChartHorizontalBar.lite';

export default function CardExample() {
  const state = useStore({ goalProgress: 76 });

  return (
    <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader title="Total Revenue">
          <Badge variant="success">↑ +20.1%</Badge>
        </CardHeader>
        <Stat value="$45,231.89" size="lg" />
        <ChartLine data={[{ label: 'W1', value: 28 }, { label: 'W2', value: 42 }, { label: 'W3', value: 36 }, { label: 'W4', value: 64 }]} showGridLines={false} showAxisLabels={false} showDots={false} chartClassName="h-10" area={true} />
      </Card>
      <Card>
        <CardHeader title="Quarterly Goal" subtitle="Target $50,000">
          <button type="button" class="cursor-pointer rounded-md border border-border-default bg-background-default px-2 py-0.5 text-xs font-medium text-foreground-default hover:bg-background-muted" onClick={() => { state.goalProgress = state.goalProgress >= 100 ? 60 : state.goalProgress + 12; }}>
            +{state.goalProgress}%
          </button>
        </CardHeader>
        <Stat value="$38,400" size="lg" />
        <Progressbar value={state.goalProgress} showLabel={true} showPercentage={false} label={(pct) => `${pct}% completed`} indicatorClassName="bg-chart-series-1" />
      </Card>
      <Card>
        <CardHeader title="User Balance Comparison" />
        <div class="flex flex-row items-center gap-3">
          <Stat value="Rp 2.45M" label="User A" reversed={true} className="flex-1" />
          <Divider orientation="vertical" className="h-9" />
          <Stat value="Rp 1.80M" label="User B" reversed={true} muted={true} className="flex-1" />
        </div>
        <CardFooter>
          <Badge variant="success">↑ +36%</Badge>
          <span class="text-xs text-foreground-muted">higher balance</span>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader title="Top Channels" subtitle="12,480 total" />
        <ChartHorizontalBar stacked={true} data={[{ label: 'Organic', value: 54 }, { label: 'Direct', value: 31 }, { label: 'Referral', value: 15 }]} barClassName="h-2" />
        <div class="flex flex-col gap-1.5">
          <ListItem badge="#1" value="5,420">Organic Search</ListItem>
          <ListItem dotTone="series-2" value="4,110">Direct Traffic</ListItem>
        </div>
      </Card>
    </div>
  );
}
