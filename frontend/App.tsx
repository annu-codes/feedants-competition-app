import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

function App() {
  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const userId = '6ab35f1efed2e66d4c9a5e15';

  useEffect(() => {
    fetch('http://10.0.2.2:5000/api/competitions')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setCompetition(data[0]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log('Error:', error);
        setLoading(false);
      });
  }, []);

  const handleRegister = async () => {
    if (!competition || isRegistered) return;

    setRegistering(true);

    try {
      const response = await fetch(
        `http://10.0.2.2:5000/api/registrations/${competition._id}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Registration Failed',
          data.message || 'Something went wrong.',
        );
        return;
      }

      setIsRegistered(true);

      setCompetition({
        ...competition,
        registeredCount: competition.registeredCount + 1,
      });

      Alert.alert(
        'Registration Successful',
        'You are successfully registered for this competition.',
      );
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server.',
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.loadingText}>Loading competition...</Text>
      </SafeAreaView>
    );
  }

  if (!competition) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.error}>No competition available.</Text>
      </SafeAreaView>
    );
  }

  const remainingSpots =
    competition.totalSpots - competition.registeredCount;

  const startDate = new Date(competition.startDate);
  const endDate = new Date(competition.endDate);
  const now = new Date();

  const hasStarted = now >= startDate;
  const hasEnded = now > endDate;
  const isFull = remainingSpots <= 0;

  let status = 'UPCOMING';

  if (hasEnded) {
    status = 'COMPLETED';
  } else if (hasStarted) {
    status = 'ONGOING';
  } else if (isFull) {
    status = 'FULL';
  }

  const canRegister =
    !isRegistered &&
    !isFull &&
    hasStarted &&
    !hasEnded;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>FEEDANTS</Text>
            <Text style={styles.headerSub}>COMPETITIONS</Text>
          </View>

          <View style={styles.liveDot}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroSmall}>COMPETITION DETAILS</Text>

          <Text style={styles.title}>
            {competition.title}
          </Text>

          <Text style={styles.description}>
            {competition.description}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                status === 'ONGOING' && styles.ongoing,
                status === 'COMPLETED' && styles.completed,
                status === 'FULL' && styles.full,
              ]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>

            <Text style={styles.spotsText}>
              {remainingSpots > 0
                ? `${remainingSpots} spots left`
                : 'No spots left'}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {competition.totalSpots}
            </Text>
            <Text style={styles.statLabel}>TOTAL SPOTS</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {competition.registeredCount}
            </Text>
            <Text style={styles.statLabel}>REGISTERED</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {remainingSpots}
            </Text>
            <Text style={styles.statLabel}>AVAILABLE</Text>
          </View>
        </View>

        {/* DATE SECTION */}
        <Text style={styles.sectionTitle}>Competition Timeline</Text>

        <View style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineCircle}>
              <Text style={styles.circleText}>1</Text>
            </View>

            <View>
              <Text style={styles.timelineLabel}>START DATE</Text>
              <Text style={styles.timelineValue}>
                {formatDate(startDate)}
              </Text>
            </View>
          </View>

          <View style={styles.line} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineCircle}>
              <Text style={styles.circleText}>2</Text>
            </View>

            <View>
              <Text style={styles.timelineLabel}>END DATE</Text>
              <Text style={styles.timelineValue}>
                {formatDate(endDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* PARTICIPATION */}
        <Text style={styles.sectionTitle}>Your Participation</Text>

        <View style={styles.participationCard}>
          <View>
            <Text style={styles.participationTitle}>
              {isRegistered
                ? 'You are registered'
                : 'Join this competition'}
            </Text>

            <Text style={styles.participationSub}>
              {isRegistered
                ? 'Your participation has been confirmed.'
                : 'Register now to participate in this competition.'}
            </Text>
          </View>

          <View style={styles.checkCircle}>
            <Text style={styles.check}>
              {isRegistered ? '✓' : '→'}
            </Text>
          </View>
        </View>

        {/* BUTTON */}
        <Pressable
          onPress={handleRegister}
          disabled={!canRegister || registering}
          style={[
            styles.button,
            (!canRegister || registering) &&
              styles.disabledButton,
          ]}>
          <Text style={styles.buttonText}>
            {registering
              ? 'Registering...'
              : isRegistered
              ? '✓  Registered'
              : isFull
              ? 'Competition Full'
              : hasEnded
              ? 'Competition Completed'
              : !hasStarted
              ? 'Registration Not Open'
              : 'Register Now  →'}
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Your registration is securely processed through the
          Feedants backend.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },

  error: {
    fontSize: 18,
    color: '#111827',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111827',
  },

  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 2,
    marginTop: 2,
  },

  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },

  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
  },

  hero: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },

  heroSmall: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 12,
  },

  description: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  ongoing: {
    backgroundColor: '#DCFCE7',
  },

  completed: {
    backgroundColor: '#E5E7EB',
  },

  full: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },

  spotsText: {
    color: '#D1D5DB',
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
  },

  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },

  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 26,
  },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  circleText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  timelineLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 3,
  },

  timelineValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  line: {
    height: 22,
    width: 1,
    backgroundColor: '#D1D5DB',
    marginLeft: 18,
    marginVertical: 4,
  },

  participationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  participationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  participationSub: {
    marginTop: 5,
    color: '#6B7280',
    fontSize: 12,
    maxWidth: 260,
  },

  checkCircle: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  button: {
    backgroundColor: '#111827',
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#9CA3AF',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 14,
    lineHeight: 17,
  },
});

export default App;