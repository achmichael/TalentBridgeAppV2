import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

type AlertType = 'info' | 'success' | 'error';

interface AlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const { width } = Dimensions.get('window');

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseTime);
        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#E7F7EF',
          borderColor: '#34D399',
          iconColor: '#10B981',
          titleColor: '#065F46',
          messageColor: '#047857',
        };
      case 'error':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#F87171',
          iconColor: '#EF4444',
          titleColor: '#991B1B',
          messageColor: '#B91C1C',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#E0F2FE',
          borderColor: '#38BDF8',
          iconColor: '#0EA5E9',
          titleColor: '#0C4A6E',
          messageColor: '#0369A1',
        };
    }
  };

  const renderIcon = () => {
    const styles = getAlertStyles();
    const iconProps = {
      width: 24,
      height: 24,
      color: styles.iconColor,
      strokeWidth: 2,
    };

    switch (type) {
      case 'success':
        return <MaterialIcons name="check-circle" {...iconProps} />;
      case 'error':
        return <MaterialCommunityIcons name="alert-circle" {...iconProps} />;
      case 'info':
      default:
        return <MaterialIcons name="info" {...iconProps} />;
    }
  };

  const styles = getAlertStyles();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={modalStyles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                modalStyles.container,
                {
                  backgroundColor: styles.backgroundColor,
                  borderColor: styles.borderColor,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={modalStyles.header}>
                <View style={modalStyles.iconContainer}>{renderIcon()}</View>
                <TouchableOpacity onPress={handleClose} style={modalStyles.closeButton}>
                  <MaterialIcons name="close" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={modalStyles.content}>
                <Text style={[modalStyles.title, { color: styles.titleColor }]}>
                  {title}
                </Text>
                <Text style={[modalStyles.message, { color: styles.messageColor }]}>
                  {message}
                </Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    borderLeftWidth: 4,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AlertModal;