import React, { useEffect, useState } from 'react'
import InstructorMessageAPI from '../../api/instructor_message'
import { connect } from 'react-redux'
import ErrorCard from '../../components/Error/ErrorCard'
import { useTranslation } from 'react-i18next';
import ErrorAlert from '../../components/Error/ErrorAlert'
import { useNavigation } from '@react-navigation/native'
import { logout } from '../../action/creators'
import { FlatList, Text } from 'react-native';
import MenuName from '../../components/MenuName'
import InstructorCard from './InstructorCard';
import MessagePage from '../../components/Message/MessagePage';

const InstructorMessage = ({ currentUser, student, logout }) => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const [data, setData] = useState([])
    // const [dates, setDates] = useState([])
    const [loaded, setLoaded] = useState(false)

    // apiye istediği dataları tek bir objeden göndermek için oluşturduğumuz obje
    const studentData = {
        token: currentUser.token,
        ogrenciID: student.ogrenciID,
    }
    // Sayfa yüklendiği anda apiden verileri çekiyoruz.
    useEffect(() => {
        InstructorMessageAPI.getTeachers(studentData, (resp, err) => {
            console.log(resp)
            setData(resp.ogretmenler)
            // if (resp.status === 'success' && err == false) {
            //     setData(resp.takvim)
            //     setDates(resp.dates)
            //     setLoaded(true)
            // } else if (resp.status === 'noData' && err === false) {
            //     setLoaded(true);
            //     setError(true);
            // } else {
            //     setLoaded(true)
            //     const respError = ErrorAlert(resp.message)
            //     if (respError === 'kick') {
            //         logout();
            //     }
            // }

        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const renderInstructor = ({ item }) => {
        return <InstructorCard item={item} />
    }

    // console.log("Ana data ", data);
    return (
        <>
            {
                data.length == 1 ?
                    <>
                        <MenuName menuName={data[0].ad_soyad} />

                        <MessagePage dataID={data[0].ogretmenID} />
                    </>
                    :
                    <>
                        <MenuName menuName={'Öğretmen Seçimi'} />
                        <FlatList
                            data={data}
                            renderItem={renderInstructor}
                        />
                    </>
            }
        </>
    )
}

const mapStateToProps = ({ student, currentUser }) => {
    return { student, currentUser }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})
export default connect(mapStateToProps, mapDispatchToProps)(InstructorMessage)
